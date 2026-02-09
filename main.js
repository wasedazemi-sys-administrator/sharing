const LIFF_ID = "2009089931-EdnMOVSO";

async function initLiff() {
  await liff.init({ liffId: LIFF_ID });

  if (!liff.isLoggedIn()) {
    liff.login();
  }
}

/*
async function share() {
  try {
    const profile = await liff.getProfile();
    const userId = profile.userId;

    // 紹介URL
    const referralUrl = `https://example.com/trial?ref=${userId}`;

    const flexMessage = {
      type: "flex",
      altText: "友だち紹介キャンペーン",
      contents: {
        type: "bubble",
        hero: {
          type: "image",
          url: "https://scdn.line-apps.com/n/channel_devcenter/img/fx/01_1_cafe.png", // ←キャンペーン画像
          size: "full",
          aspectRatio: "20:13",
          aspectMode: "cover"
        },
        body: {
          type: "box",
          layout: "vertical",
          spacing: "md",
          contents: [
            {
              type: "text",
              text: "🎁 友だち紹介キャンペーン",
              weight: "bold",
              size: "lg"
            },
            {
              type: "text",
              text: "この塾、正直かなり良かった。\nまずは無料体験がおすすめ！",
              wrap: true,
              size: "sm",
              color: "#555555"
            },
            {
              type: "separator"
            },
            {
              type: "text",
              text: "▼ 無料体験はこちら",
              size: "sm",
              weight: "bold"
            }
          ]
        },
        footer: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "button",
              style: "primary",
              color: "#06C755",
              action: {
                type: "uri",
                label: "無料体験に申し込む",
                uri: referralUrl
              }
            }
          ]
        }
      }
    };

    const result = await liff.shareTargetPicker([flexMessage]);

    if (result) {
      showToast("🎉 紹介メッセージを送信しました！");
    }

  } catch (e) {
    console.error(e);
    showToast("⚠️ エラーが発生しました");
  }
}*/

async function share() {
  try {
    if (!liff.isApiAvailable("shareTargetPicker")) {
      alert("この環境では共有できません");
      return;
    }

    const result = await liff.shareTargetPicker([
      {
        type: "text",
        text: "テスト送信です"
      }
    ]);

    if (result) {
      alert("送信成功");
    }
  } catch (e) {
    console.error(e);
    alert(e.message);
  }
}


function showToast(message) {
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0,0,0,0.8);
    color: #fff;
    padding: 12px 20px;
    border-radius: 30px;
    font-size: 14px;
    z-index: 9999;
  `;
  document.body.appendChild(toast);

  setTimeout(() => toast.remove(), 2500);
}

document.getElementById("shareBtn").addEventListener("click", share);

initLiff();
