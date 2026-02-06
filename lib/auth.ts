import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Naver from "next-auth/providers/naver";
import Kakao from "next-auth/providers/kakao";
import Credentials from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: true,
  trustHost: true,
  useSecureCookies: false, // HTTP 환경에서 필수
  cookies: {
    state: {
      name: "next-auth.state",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: false, // HTTP 환경
      },
    },
    pkceCodeVerifier: {
      name: "next-auth.pkce.code_verifier",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: false,
      },
    },
  },
  // PrismaAdapter 제거 - JWT 전략만 사용 (모든 로그인 방식 통일)
  session: { strategy: "jwt" },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      checks: [], // HTTP 환경에서 PKCE 검증 비활성화
    }),
    Naver({
      clientId: process.env.AUTH_NAVER_ID,
      clientSecret: process.env.AUTH_NAVER_SECRET,
      checks: [], // HTTP 환경에서 PKCE 검증 비활성화 (구글과 동일)
      profile(profile) {
        // Naver API 응답 구조: { response: { id, nickname, email, profile_image } }
        return {
          id: profile.response.id, // Provider ID (JWT 콜백에서 DB ID로 교체됨)
          name: profile.response.nickname || profile.response.name,
          email: profile.response.email,
          image: profile.response.profile_image,
        };
      },
    }),
    // Kakao는 환경 변수가 설정된 경우에만 활성화
    ...(process.env.AUTH_KAKAO_ID && process.env.AUTH_KAKAO_SECRET
      ? [
          Kakao({
            clientId: process.env.AUTH_KAKAO_ID,
            clientSecret: process.env.AUTH_KAKAO_SECRET,
          }),
        ]
      : []),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findFirst({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) return null;

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile: _profile }) {
      // 소셜 로그인 시 사용자 DB에 저장/업데이트
      if (account?.provider && account.provider !== 'credentials') {
        try {
          console.warn(`[SignIn] Provider: ${account.provider}, Email: ${user.email}`);
          
          const existingUser = await prisma.user.findFirst({
            where: {
              accounts: {
                some: {
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                },
              },
            },
          });

          if (!existingUser) {
            // 새 사용자 생성
            console.warn(`[SignIn] Creating new user for ${account.provider}`);
            const newUser = await prisma.user.create({
              data: {
                name: user.name,
                email: user.email,
                image: user.image,
                accounts: {
                  create: {
                    type: account.type,
                    provider: account.provider,
                    providerAccountId: account.providerAccountId,
                    access_token: account.access_token,
                    refresh_token: account.refresh_token,
                    expires_at: account.expires_at,
                    token_type: account.token_type,
                    scope: account.scope,
                    id_token: account.id_token,
                  },
                },
              },
            });
            console.warn(`[SignIn] User created successfully with ID: ${newUser.id}`);
          } else {
            console.warn(`[SignIn] Existing user found with ID: ${existingUser.id}`);
          }
        } catch (error) {
          console.error(`[SignIn] Error for ${account.provider}:`, error);
          // 에러 발생 시 로그인 실패
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, trigger, session, account }) {
      // 초기 로그인 시 또는 토큰 업데이트 시
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;

        // 우선순위 1: Account 정보(Provider)로 DB 사용자 찾기 (가장 정확함)
        if (account?.provider && account?.providerAccountId) {
          try {
            console.warn(`[JWT] Looking up user by account: ${account.provider} / ${account.providerAccountId}`);
            const userByAccount = await prisma.user.findFirst({
              where: {
                accounts: {
                  some: {
                    provider: account.provider,
                    providerAccountId: account.providerAccountId,
                  },
                },
              },
            });

            if (userByAccount) {
              console.warn(`[JWT] Found DB user by account with ID: ${userByAccount.id}`);
              token.id = userByAccount.id;
              token.image = userByAccount.image || token.image;
            } else if (user.email) {
              // Account로 못 찾았는데 이메일이 있는 경우 (기존 계정 연동 고려)
              console.warn(`[JWT] No DB user found by account, retrying with email: ${user.email}`);
              const dbUser = await prisma.user.findFirst({
                where: { email: user.email },
              });
              if (dbUser) {
                console.warn(`[JWT] Found DB user by email with ID: ${dbUser.id}`);
                token.id = dbUser.id;
                token.image = dbUser.image || token.image;
              }
            }
          } catch (error) {
            console.error('[JWT] Error fetching user by account:', error);
          }
        }
        // 우선순위 2: 이메일로 찾기 (Account 정보가 없는 경우)
        else if (user.email) {
          try {
            console.warn(`[JWT] Looking up user by email: ${user.email}`);
            const dbUser = await prisma.user.findFirst({
              where: { email: user.email },
            });

            if (dbUser) {
              console.warn(`[JWT] Found DB user with ID: ${dbUser.id}`);
              token.id = dbUser.id;
              token.image = dbUser.image || token.image;
            }
          } catch (error) {
            console.error('[JWT] Error fetching user by email:', error);
          }
        }
      }

      // 토큰 검증: 토큰의 ID가 실제 DB ID인지 확인 (기존 사용자 로그인 시)
      if (!user && token.id && token.email) {
        try {
          // 먼저 ID로 사용자가 존재하는지 확인
          const userById = await prisma.user.findUnique({
            where: { id: token.id as string },
          });

          if (!userById) {
            // ID로 찾지 못하면 Provider ID일 가능성 → email로 재조회
            console.warn(`[JWT] Token ID not found in DB: ${token.id}, retrying with email: ${token.email}`);
            const userByEmail = await prisma.user.findFirst({
              where: { email: token.email as string },
            });

            if (userByEmail) {
              console.warn(`[JWT] Corrected token ID from ${token.id} to ${userByEmail.id}`);
              token.id = userByEmail.id;
              token.image = userByEmail.image || token.image;
            }
          }
        } catch (error) {
          console.error('[JWT] Error validating token ID:', error);
        }
      }

      // 세션 업데이트 (client-side update() 호출 시)
      if (trigger === "update" && session) {
        if (session.image) token.image = session.image;
        if (session.name) token.name = session.name;
      }

      return token;
    },
    async session({ session, token }) {
      // JWT 전략 사용 시: token에서 사용자 정보 가져오기
      if (session?.user && token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.image as string;
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
});
