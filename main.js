const LIFF_ID = "2009089929-SQzhts9r";

async function initLiff() {
  await liff.init({ liffId: LIFF_ID });

  if (!liff.isLoggedIn()) {
    liff.login();
  }
}

async function share() {
  try {
    const profile = await liff.getProfile();
    const userId = profile.userId;

    // 最小構成：userIdをそのまま紹介コードにする
    const referralUrl =
      `https://example.com/trial?ref=${userId}`;

    const message = `📣 友だち紹介！

この塾、かなり良かったよ。
まずは無料体験から👇
${referralUrl}`;

    const result = await liff.shareTargetPicker([
      {
        type: "text",
        text: message
      }
    ]);

    if (result) {
      alert("送信しました！");
    }

  } catch (e) {
    console.error(e);
    alert("エラーが発生しました");
  }
}

document.getElementById("shareBtn").addEventListener("click", share);

initLiff();
