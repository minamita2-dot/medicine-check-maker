const form = document.querySelector("#checkForm");
const result = document.querySelector("#result");
const changeNotice = document.querySelector("#changeNotice");
const copyNotice = document.querySelector("#copyNotice");
const copyButton = document.querySelector("#copyButton");
const conditionSummary = document.querySelector("#conditionSummary");

const labels = {
  symptom: {
    fever: "発熱",
    cough: "咳",
    nose: "鼻水・鼻づまり",
    throat: "のど",
    pain: "頭痛・関節痛",
    multiple: "複数症状"
  },
  userType: {
    adult: "成人",
    elderly: "高齢者",
    child: "小児",
    pregnancy: "妊娠・授乳中",
    proxy: "家族が代理購入"
  },
  concerns: {
    drowsiness: "眠気を避けたい",
    driving: "運転予定あり",
    medicine: "服用中の薬あり",
    condition: "持病あり",
    allergy: "アレルギー歴あり",
    unknown: "よくわからない"
  },
  level: {
    beginner: "新人向け",
    normal: "通常",
    senior: "先輩確認用"
  }
};

const statusLabels = {
  normal: "通常確認を続ける",
  consult: "先輩・薬剤師へ相談",
  visit: "受診相談を案内"
};

const symptomBranches = {
  fever: [
    {
      answer: "「熱がある」",
      next: "体温、いつから続いているか、水分が取れているか、ぐったり感があるかを確認する。",
      status: "normal"
    },
    {
      answer: "「高めの熱が続いている」",
      next: "日数、解熱鎮痛薬の使用歴、強い頭痛、息苦しさ、他の症状の有無を確認する。",
      status: "consult"
    },
    {
      answer: "「水分が取れない、ぐったりしている」",
      next: "売場だけで整理しきろうとせず、症状の経過と状態を聞き取り、受診相談の案内を検討する。",
      status: "visit"
    },
    {
      answer: "「強い頭痛や息苦しさもある」",
      next: "いつからあるか、急な悪化か、会話や歩行に支障がないかを確認し、早めに先輩・薬剤師へ共有する。",
      status: "visit"
    }
  ],
  cough: [
    {
      answer: "「乾いた咳が出る」",
      next: "いつから続いているか、夜眠りにくいか、発熱やのどの痛みがあるかを確認する。",
      status: "normal"
    },
    {
      answer: "「たんが絡む」",
      next: "たんの量、色、出しにくさ、発熱、息苦しさがあるかを確認する。",
      status: "normal"
    },
    {
      answer: "「息苦しい、ぜいぜいする」",
      next: "ぜんそく歴、呼吸のつらさ、発熱、症状が急に強くなったかを確認し、相談につなげる。",
      status: "consult"
    },
    {
      answer: "「咳が長く続いている」",
      next: "続いている日数、夜間の咳、発熱、持病、服用中の薬を確認し、売場での対応範囲を整理する。",
      status: "consult"
    }
  ],
  nose: [
    {
      answer: "「鼻水がつらい」",
      next: "鼻水の状態、くしゃみ、発熱、眠気が困る予定や運転予定があるかを確認する。",
      status: "normal"
    },
    {
      answer: "「鼻づまりがつらい」",
      next: "つまっている期間、睡眠への影響、発熱、緑内障や排尿トラブルを聞き取る。",
      status: "normal"
    },
    {
      answer: "「眠くなると困る」",
      next: "仕事、運転、機械操作などの予定を確認し、眠気に関する注意記載を添付文書で確認する。",
      status: "consult"
    },
    {
      answer: "「緑内障や排尿トラブルがある」",
      next: "自己判断で進めず、該当する持病や治療中の内容を整理して先輩・薬剤師へ相談する。",
      status: "consult"
    }
  ],
  throat: [
    {
      answer: "「のどが痛い」",
      next: "痛みの強さ、発熱、飲み込みにくさ、何日続いているかを確認する。",
      status: "normal"
    },
    {
      answer: "「声が出にくい」",
      next: "咳、発熱、仕事で声を使うか、症状の期間を確認する。",
      status: "normal"
    },
    {
      answer: "「飲み込むのがつらい」",
      next: "水分が取れているか、強い腫れ感、高熱の有無を確認する。",
      status: "consult"
    },
    {
      answer: "「熱もある」",
      next: "体温、何日続いているか、ぐったり感、咳や鼻症状など他の症状を確認する。",
      status: "normal"
    }
  ],
  pain: [
    {
      answer: "「頭痛がある」",
      next: "痛みの強さ、いつからか、発熱、吐き気、普段と違う痛みかを確認する。",
      status: "normal"
    },
    {
      answer: "「関節痛や体の痛みがある」",
      next: "発熱、だるさ、症状の始まり、日常動作への影響を確認する。",
      status: "normal"
    },
    {
      answer: "「ほかの解熱鎮痛薬も使っている」",
      next: "成分の重複、服用間隔、服用中の薬、持病を確認し、先輩・薬剤師へ相談する。",
      status: "consult"
    },
    {
      answer: "「強い痛み、急な痛み、いつもと違う痛み」",
      next: "痛みの出方、発熱、しびれ、息苦しさなどを確認し、受診相談の案内を検討する。",
      status: "visit"
    }
  ],
  multiple: [
    {
      answer: "「症状がいくつもある」",
      next: "一番困っている症状、症状の優先順位、いつから順番に出たかを確認する。",
      status: "normal"
    },
    {
      answer: "「熱、咳、鼻、のど、痛みが重なっている」",
      next: "総合感冒薬の成分が重なりやすい場面として、服用中の薬や過去に使った薬を確認する。",
      status: "consult"
    },
    {
      answer: "「どれを優先したらよいかわからない」",
      next: "本人が最も困っている症状と、避けたいことを聞き取り、相談前に要点をまとめる。",
      status: "consult"
    },
    {
      answer: "「症状が強い、長引く、悪化している」",
      next: "日数、急な悪化、水分摂取、息苦しさ、強い痛みを確認し、受診相談の案内を検討する。",
      status: "visit"
    }
  ]
};

const userTypeBranches = {
  elderly: [
    {
      answer: "「いつもの薬を飲んでいる」",
      next: "お薬手帳や服用中の薬の内容を確認し、成分の重複や注意事項に迷う場合は先輩・薬剤師へ相談する。",
      status: "consult"
    },
    {
      answer: "「持病がある、通院している」",
      next: "病名、治療状況、医師から薬について指示があるかを確認し、判断に迷う点を整理する。",
      status: "consult"
    }
  ],
  child: [
    {
      answer: "「子どもが使う」",
      next: "年齢、体重、使用する剤形、保護者が症状をいつから把握しているか確認する。",
      status: "normal"
    },
    {
      answer: "「子どもの症状が強い、長引いている」",
      next: "発熱の日数、水分摂取、ぐったり感、咳や息苦しさの有無を確認し、相談先を整理する。",
      status: "consult"
    }
  ],
  pregnancy: [
    {
      answer: "「妊娠中・授乳中でも使えるか聞かれた」",
      next: "自己判断で案内せず、店舗ルールに沿って薬剤師・登録販売者へ相談する。",
      status: "consult"
    },
    {
      answer: "「妊娠週数や授乳状況を聞いていない」",
      next: "妊娠中か授乳中か、妊娠週数、医師や助産師からの指示の有無を確認する。",
      status: "consult"
    }
  ],
  proxy: [
    {
      answer: "「本人の症状がよくわからない」",
      next: "年齢、症状、いつから、発熱の有無、服用中の薬、持病を本人に確認してもらう。",
      status: "consult"
    },
    {
      answer: "「家族に頼まれて来た」",
      next: "本人が使うこと、年齢、症状の経過、薬歴、アレルギー歴を購入者が把握しているか確認する。",
      status: "normal"
    }
  ]
};

const concernChecks = {
  drowsiness: "眠気に関する注意記載、運転・仕事への影響、服用タイミングを確認する。",
  driving: "運転や機械操作に関する注意事項を添付文書や店舗ルールに沿って確認する。",
  medicine: "お薬手帳、薬の現物、成分の重複、飲み合わせに関する確認を行い、迷う場合は先輩・薬剤師へ相談する。",
  condition: "病名、治療中か、主治医から薬の使用について指示があるかを確認する。",
  allergy: "何で、どのような症状が出たことがあるかを確認し、成分確認に迷う場合は相談する。",
  unknown: "情報が不足している場合は無理に進めず、本人確認、薬の現物、お薬手帳、症状の経過など追加情報を確認する。"
};

// フォームの現在の選択内容を、扱いやすい形にまとめます。
function getFormData() {
  const data = new FormData(form);

  return {
    symptom: data.get("symptom"),
    userType: data.get("userType"),
    concerns: data.getAll("concerns"),
    level: data.get("level")
  };
}

function makeChecklist(data) {
  const sections = [
    {
      type: "list",
      title: "1. 最初に聞くこと",
      items: firstQuestions(data)
    },
    {
      type: "branches",
      title: "2. お客様の返答別：次の確認ポイント",
      branches: branchItems(data)
    },
    {
      type: "list",
      title: "3. 注意して確認すること",
      items: cautionItems(data)
    },
    {
      type: "list",
      title: "4. 条件別の追加確認ポイント",
      items: concernItems(data)
    },
    {
      type: "list",
      title: "5. 先輩・薬剤師へ相談したい目安",
      items: consultItems(data)
    },
    {
      type: "list",
      title: "6. 受診相談を案内したい目安",
      items: visitItems(data)
    },
    {
      type: "memo",
      title: "7. 接客メモまとめ",
      items: memoItems(data)
    }
  ];

  if (data.level === "senior") {
    sections.push({
      type: "memo",
      title: "先輩・薬剤師へ相談するときの整理メモ",
      items: seniorMemoItems(data)
    });
  }

  sections.push({
    type: "list",
    title: "8. 注意書き",
    className: "notice-box",
    items: [
      "このツールは、新人登録販売者が総合感冒薬・風邪薬の接客前後に確認事項を整理するための補助ツールです。",
      "薬の選択、使用可否、受診の要否を判断するものではありません。",
      "最終確認は、添付文書、店舗ルール、薬剤師・登録販売者の判断に従ってください。",
      "特定の商品名は扱わず、効果やリスクを断定・保証する表現は避けてください。"
    ]
  });

  return sections;
}

function branchItems(data) {
  const selectedSymptomBranches = symptomBranches[data.symptom];
  const selectedUserTypeBranches = userTypeBranches[data.userType] || [];

  return [...selectedSymptomBranches, ...selectedUserTypeBranches];
}

function firstQuestions(data) {
  const questions = [
    "どなたが使用するか、年齢、体格の目安を確認する。",
    "いつから、どの症状が、どの程度あるかを確認する。",
    "一番困っている症状と、避けたいことを確認する。",
    "服用中の薬、持病、アレルギー歴、過去に薬で困った経験がないか確認する。"
  ];

  if (data.level === "beginner") {
    questions.unshift("聞いた内容を短くメモし、すぐに結論を出そうとしない。");
  }

  if (data.userType === "proxy") {
    questions.push("代理購入の場合、本人の状態をどこまで把握しているか確認する。");
  }

  return questions;
}

function cautionItems(data) {
  const items = [];

  if (data.userType === "elderly") {
    items.push("高齢者では、持病、服用中の薬、眠気やふらつきに関する注意点を丁寧に確認する。");
  }

  if (data.userType === "child") {
    items.push("小児では、年齢、体重、使える剤形、保護者が把握している症状の経過を確認する。");
  }

  if (data.userType === "pregnancy") {
    items.push("妊娠・授乳中は、自己判断で案内を進めず、店舗ルールに沿って相談する。");
  }

  if (data.userType === "proxy") {
    items.push("代理購入では、本人の年齢、症状、薬歴、アレルギー歴が不明なまま進めない。");
  }

  if (data.concerns.includes("drowsiness")) {
    items.push("眠気を避けたい理由を確認し、眠気に関する注意記載を添付文書で確認する。");
  }

  if (data.concerns.includes("driving")) {
    items.push("運転予定がある場合は、服用後の運転などに関する注意記載を必ず確認する。");
  }

  if (data.concerns.includes("medicine")) {
    items.push("服用中の薬がある場合は、成分の重複や飲み合わせに注意し、先輩・薬剤師へ相談する。");
  }

  if (data.concerns.includes("condition")) {
    items.push("持病がある場合は、病名、治療状況、主治医からの指示の有無を聞き取る。");
  }

  if (data.concerns.includes("allergy")) {
    items.push("アレルギー歴がある場合は、原因になった薬や症状、時期を確認する。");
  }

  if (data.concerns.includes("unknown")) {
    items.push("情報がよくわからない場合は、無理に進めず、追加確認または相談につなげる。");
  }

  if (items.length === 0) {
    items.push("特別な条件がない場合でも、服用中の薬、持病、アレルギー歴は毎回確認する。");
  }

  return items;
}

function concernItems(data) {
  if (data.concerns.length === 0) {
    return ["気になる条件が未選択の場合も、服用中の薬、持病、アレルギー歴は毎回確認する。"];
  }

  return data.concerns.map((concern) => `${labels.concerns[concern]}：${concernChecks[concern]}`);
}

function consultItems(data) {
  const items = [
    "小児、高齢者、妊娠・授乳中、代理購入で情報が不足している場合。",
    "服用中の薬、持病、アレルギー歴があり、確認すべき点に迷う場合。",
    "総合感冒薬に含まれる複数成分の重複確認が必要になりそうな場合。",
    "眠気、運転、仕事上の制約など、注意の説明に迷う場合。"
  ];

  if (data.level === "senior") {
    items.unshift("自分の聞き取り内容を、症状・使用者・気になる条件の順に短くまとめて確認する。");
  }

  if (data.symptom === "multiple") {
    items.push("症状が多く、どの確認事項を優先するか迷う場合。");
  }

  return items;
}

function visitItems(data) {
  const items = [
    "症状が強い、長引いている、急に悪化しているなど、売場での確認に限界がある場合。",
    "高熱、息苦しさ、強い痛み、ぐったり感、水分が取れない様子などがある場合。",
    "小児、高齢者、妊娠・授乳中、持病がある人で、状態の判断に迷う場合。",
    "お客様の話だけでは状態が整理できず、一般用医薬品の相談範囲を超えそうな場合。"
  ];

  if (data.symptom === "fever") {
    items.push("発熱に加えて、強い頭痛、息苦しさ、水分摂取の難しさがある場合。");
  }

  if (data.symptom === "cough") {
    items.push("咳に加えて、息苦しさ、ぜいぜいする感じ、長引く症状がある場合。");
  }

  return items;
}

function memoItems(data) {
  const concernText = data.concerns.length
    ? data.concerns.map((item) => labels.concerns[item]).join("、")
    : "選択なし";

  return [
    {
      label: "主な症状",
      text: labels.symptom[data.symptom]
    },
    {
      label: "使用する人",
      text: labels.userType[data.userType]
    },
    {
      label: "気になる条件",
      text: concernText
    },
    {
      label: "接客レベル",
      text: labels.level[data.level]
    },
    {
      label: "次の一手",
      text: "お客様の返答を分岐例に当てはめ、足りない情報を確認してから相談先を整理する。"
    },
    {
      label: "判断表示",
      text: "通常確認を続ける / 先輩・薬剤師へ相談 / 受診相談を案内"
    }
  ];
}

function seniorMemoItems(data) {
  const concernText = data.concerns.length
    ? data.concerns.map((item) => labels.concerns[item]).join("、")
    : "選択なし";

  return [
    {
      label: "使用する人",
      text: labels.userType[data.userType]
    },
    {
      label: "主な症状",
      text: labels.symptom[data.symptom]
    },
    {
      label: "気になる条件",
      text: concernText
    },
    {
      label: "症状の期間",
      text: "未確認"
    },
    {
      label: "一番つらい症状",
      text: "未確認"
    },
    {
      label: "発熱の有無",
      text: "未確認"
    },
    {
      label: "服用中の薬",
      text: "未確認"
    },
    {
      label: "持病",
      text: "未確認"
    },
    {
      label: "アレルギー歴",
      text: "未確認"
    },
    {
      label: "確認できていない情報",
      text: missingInfoText(data)
    },
    {
      label: "相談したい点",
      text: seniorConsultPoint(data)
    }
  ];
}

function missingInfoText(data) {
  const items = [
    "症状の期間",
    "一番つらい症状",
    "発熱の有無",
    "服用中の薬の詳細",
    "持病の詳細",
    "アレルギー歴の詳細"
  ];

  if (data.userType === "proxy") {
    items.push("本人に確認した症状の詳細");
  }

  return items.join("、");
}

function seniorConsultPoint(data) {
  const points = [];

  if (data.symptom === "multiple") {
    points.push("総合感冒薬の接客で、症状の優先順位、成分の重複、受診相談の必要性がないか確認したい。");
  } else {
    points.push(`${labels.symptom[data.symptom]}を主訴として、追加で確認すべき症状や注意事項を整理したい。`);
  }

  if (data.concerns.includes("medicine")) {
    points.push("服用中の薬との成分重複や注意事項について確認したい。");
  }

  if (data.concerns.includes("condition")) {
    points.push("持病や治療状況に応じて、確認すべき注意事項がないか相談したい。");
  }

  if (data.concerns.includes("allergy")) {
    points.push("アレルギー歴に関係する成分確認の進め方を確認したい。");
  }

  if (data.concerns.includes("drowsiness") || data.concerns.includes("driving")) {
    points.push("眠気や運転に関する注意事項の説明内容を確認したい。");
  }

  if (data.userType === "pregnancy") {
    points.push("妊娠・授乳中のため、自己判断で進めず、店舗ルールに沿って確認したい。");
  }

  if (data.userType === "child") {
    points.push("小児の年齢、体重、剤形、保護者の把握状況を踏まえた確認点を整理したい。");
  }

  if (data.userType === "elderly") {
    points.push("高齢者の服用中の薬、持病、眠気やふらつきに関する注意点を確認したい。");
  }

  if (data.userType === "proxy") {
    points.push("代理購入のため、本人に追加確認が必要な情報を整理したい。");
  }

  if (data.concerns.includes("unknown")) {
    points.push("情報が不足しているため、追加で確認すべき内容を整理したい。");
  }

  return points.join(" ");
}

function renderChecklist(data) {
  const sections = makeChecklist(data);
  const concernText = data.concerns.length
    ? data.concerns.map((item) => labels.concerns[item]).join("、")
    : "選択なし";

  conditionSummary.textContent = `主な症状：${labels.symptom[data.symptom]} / 使用する人：${labels.userType[data.userType]} / 気になる条件：${concernText} / 接客レベル：${labels.level[data.level]}`;

  result.innerHTML = sections.map((section) => renderSection(section)).join("");
}

function renderSection(section) {
  const className = section.className ? `check-section ${section.className}` : "check-section";

  if (section.type === "branches") {
    const cards = section.branches.map((branch) => {
      return `
        <div class="branch-card">
          <div class="branch-top">
            <p class="answer">${branch.answer}</p>
            <span class="status ${branch.status}">${statusLabels[branch.status]}</span>
          </div>
          <p class="next-check">→ ${branch.next}</p>
        </div>
      `;
    }).join("");

    return `<article class="${className}"><h3>${section.title}</h3><div class="branch-list">${cards}</div></article>`;
  }

  if (section.type === "memo") {
    const memo = section.items.map((item) => {
      return `<div class="memo-item"><strong>${item.label}</strong><p>${item.text}</p></div>`;
    }).join("");

    return `<article class="${className}"><h3>${section.title}</h3><div class="memo-grid">${memo}</div></article>`;
  }

  const items = section.items.map((item) => `<li>${item}</li>`).join("");
  return `<article class="${className}"><h3>${section.title}</h3><ul>${items}</ul></article>`;
}

function getResultText() {
  const heading = "医薬品接客チェックメーカー ～総合感冒薬編～";
  const summary = conditionSummary.textContent;
  const sections = [...result.querySelectorAll(".check-section")].map((section) => {
    const title = section.querySelector("h3").textContent;
    const branchCards = [...section.querySelectorAll(".branch-card")];
    const memoItems = [...section.querySelectorAll(".memo-item")];

    if (branchCards.length > 0) {
      const lines = branchCards.map((card) => {
        const answer = card.querySelector(".answer").textContent;
        const status = card.querySelector(".status").textContent;
        const next = card.querySelector(".next-check").textContent;
        return `- ${answer} [${status}] ${next}`;
      }).join("\n");
      return `${title}\n${lines}`;
    }

    if (memoItems.length > 0) {
      const lines = memoItems.map((item) => {
        const label = item.querySelector("strong").textContent;
        const text = item.querySelector("p").textContent;
        return `- ${label}: ${text}`;
      }).join("\n");
      return `${title}\n${lines}`;
    }

    const lines = [...section.querySelectorAll("li")].map((item) => `- ${item.textContent}`).join("\n");
    return `${title}\n${lines}`;
  });

  return [heading, summary, ...sections].join("\n\n");
}

// 条件を変えただけでは結果を更新せず、案内文だけを出します。
form.addEventListener("change", () => {
  changeNotice.textContent = "条件を変更しました。ボタンを押すとチェックリストを更新します。";
  copyNotice.textContent = "";
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  renderChecklist(getFormData());
  changeNotice.textContent = "";
  copyNotice.textContent = "";
});

copyButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(getResultText());
    copyNotice.textContent = "結果をコピーしました。";
  } catch (error) {
    copyNotice.textContent = "コピーできませんでした。画面の結果を選択してコピーしてください。";
  }
});

// ページを開いた直後に、初期条件で結果を表示します。
renderChecklist(getFormData());
