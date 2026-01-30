export interface Recipe {
  rcpSno: number | string;  // BigInt는 JSON 직렬화 문제로 number 또는 string으로 처리
  rcpTtl?: string;
  ckgNm?: string;
  rgtrId?: string;
  rgtrNm?: string;
  inqCnt: number;
  rcmmCnt: number;
  srapCnt: number;
  ckgMthActoNm?: string;  // 요리방법
  ckgStaActoNm?: string;  // 상황
  ckgMtrlActoNm?: string; // 재료
  ckgKndActoNm?: string;  // 종류
  ckgIpdc?: string;       // 소개
  ckgMtrlCn?: string;     // 재료 내용
  ckgInbunNm?: string;    // 인분
  ckgDodfNm?: string;     // 난이도
  ckgTimeNm?: string;     // 시간
  firstRegDt?: string;
  rcpImgUrl?: string;
}

export const MOCK_RECIPES: Recipe[] = [
  {
    rcpSno: 1001,
    rcpTtl: "초간단 5분 김치볶음밥",
    ckgNm: "김치볶음밥",
    rgtrId: "chef_kim",
    rgtrNm: "요리왕김쉐프",
    inqCnt: 1250,
    rcmmCnt: 320,
    srapCnt: 150,
    ckgMthActoNm: "볶음",
    ckgStaActoNm: "일상",
    ckgMtrlActoNm: "곡류",
    ckgKndActoNm: "한식",
    ckgIpdc: "자취생도 할 수 있는 5분 완성 초간단 김치볶음밥 레시피입니다. 참치만 있으면 끝!",
    ckgMtrlCn: "[재료] 밥 1공기, 김치 1/2포기, 참치 1캔, 참기름 1T, 설탕 0.5T, 고추장 0.5T",
    ckgInbunNm: "1인분",
    ckgDodfNm: "초급",
    ckgTimeNm: "10분 이내",
    firstRegDt: "20240115093000",
    rcpImgUrl: "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=400&q=80",
  },
  {
    rcpSno: 1002,
    rcpTtl: "감칠맛 폭발! 된장찌개 황금레시피",
    ckgNm: "된장찌개",
    rgtrId: "mom_cooking",
    rgtrNm: "집밥어머니",
    inqCnt: 8900,
    rcmmCnt: 2100,
    srapCnt: 5400,
    ckgMthActoNm: "끓이기",
    ckgStaActoNm: "저녁",
    ckgMtrlActoNm: "채소류",
    ckgKndActoNm: "한식",
    ckgIpdc: "고깃집 된장찌개 맛을 집에서도 그대로 재현해보세요. 비법은 쌈장 한 스푼!",
    ckgMtrlCn: "[재료] 된장 2T, 쌈장 1T, 애호박 1/2개, 두부 1/2모, 양파 1/2개, 대파 1/2대",
    ckgInbunNm: "2인분",
    ckgDodfNm: "중급",
    ckgTimeNm: "20분 이내",
    firstRegDt: "20231220182000",
    rcpImgUrl: "https://images.unsplash.com/photo-1583089892943-e02e5b017b6a?auto=format&fit=crop&w=400&q=80",
  },
  {
    rcpSno: 1003,
    rcpTtl: "크림 듬뿍 까르보나라 파스타",
    ckgNm: "까르보나라",
    rgtrId: "pasta_lover",
    rgtrNm: "파스타러버",
    inqCnt: 4500,
    rcmmCnt: 800,
    srapCnt: 1200,
    ckgMthActoNm: "볶음",
    ckgStaActoNm: "손님접대",
    ckgMtrlActoNm: "면류",
    ckgKndActoNm: "양식",
    ckgIpdc: "정통 까르보나라 스타일은 아니지만 크림 소스를 듬뿍 넣어 부드러운 맛.",
    ckgMtrlCn: "[재료] 파스타면 100g, 생크림 150ml, 우유 150ml, 베이컨 3줄, 양파 1/4개",
    ckgInbunNm: "1인분",
    ckgDodfNm: "중급",
    ckgTimeNm: "30분 이내",
    firstRegDt: "20240201120000",
    rcpImgUrl: "https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=400&q=80",
  },
  {
    rcpSno: 1004,
    rcpTtl: "시원한 콩나물국 끓이는 법",
    ckgNm: "콩나물국",
    rgtrId: "soup_master",
    rgtrNm: "국물장인",
    inqCnt: 3200,
    rcmmCnt: 150,
    srapCnt: 400,
    ckgMthActoNm: "끓이기",
    ckgStaActoNm: "해장",
    ckgMtrlActoNm: "채소류",
    ckgKndActoNm: "한식",
    ckgIpdc: "술 마신 다음날 해장으로 최고! 맑고 시원한 콩나물국 레시피입니다.",
    ckgMtrlCn: "[재료] 콩나물 300g, 대파 1대, 다진마늘 1T, 소금 1t, 멸치육수 1L",
    ckgInbunNm: "3인분",
    ckgDodfNm: "초급",
    ckgTimeNm: "20분 이내",
    firstRegDt: "20231110074000",
    rcpImgUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80",
  },
  {
    rcpSno: 1005,
    rcpTtl: "달콤짭짤 소불고기",
    ckgNm: "소불고기",
    rgtrId: "korean_bbq",
    rgtrNm: "한식대가",
    inqCnt: 15000,
    rcmmCnt: 5000,
    srapCnt: 8000,
    ckgMthActoNm: "볶음",
    ckgStaActoNm: "생일",
    ckgMtrlActoNm: "육류",
    ckgKndActoNm: "한식",
    ckgIpdc: "아이들도 좋아하는 달달한 소불고기. 밥 한 공기 뚝딱입니다.",
    ckgMtrlCn: "[재료] 소고기 불고기용 600g, 양파 1개, 당근 1/4개, 대파 1대, 팽이버섯 1봉",
    ckgInbunNm: "4인분",
    ckgDodfNm: "중급",
    ckgTimeNm: "60분 이내",
    firstRegDt: "20231005190000",
    rcpImgUrl: "https://images.unsplash.com/photo-1553163147-621957516919?auto=format&fit=crop&w=400&q=80",
  },
];
