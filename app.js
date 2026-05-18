// 本番環境（Netlify等）やローカルサーバーからLIFF_IDを取得する想定
// ※GitHub公開時は、ここを直書きせず環境変数から注入されるようにします
const LIFF_ID = "/*liff_id_placeholder*/";

// 6種類のコンテンツ設定（バナー画像とテキストの定義）
const CONTENT_SETTINGS = {
    test_prep: {
        title: "テスト対策講座",
        text: "定期テスト対策に！友だち紹介で限定講座が無料になります。",
        image: "https://example.com/images/test_prep.png",
        link: "https://example.com/lp/test_prep"
    },
    spring_course: {
        title: "春期講習",
        text: "新学年のスタートダッシュ！春期講習のご案内です。",
        image: "https://example.com/images/spring.png",
        link: "https://example.com/lp/spring"
    },
    summer_course: {
        title: "夏期講習",
        text: "夏を制する者は受験を制す！夏期講習の受付開始。",
        image: "https://example.com/images/summer.png",
        link: "https://example.com/lp/summer"
    },
    winter_course: {
        title: "冬期講習",
        text: "ラストスパート！冬期講習で実力を引き上げよう。",
        image: "https://example.com/images/winter.png",
        link: "https://example.com/lp/winter"
    },
    regular_class: {
        title: "本科授業",
        text: "通常授業の無料体験実施中！一緒に合格を目指そう。",
        image: "https://example.com/images/regular.png",
        link: "https://example.com/lp/regular"
    },
    event: {
        title: "特別イベント",
        text: "参加無料の特別イベント開催！友だちと一緒に参加しよう。",
        image: "https://example.com/images/event.png",
        link: "https://example.com/lp/event"
    }
};

let currentContent = null;

// LIFF初期化
document.addEventListener("DOMContentLoaded", () => {
    liff.init({ liffId: LIFF_ID })
        .then(() => {
            if (!liff.isLoggedIn()) {
                liff.login(); // ログインしていなければログイン画面へ
            } else {
                analyzeUrl();
            }
        })
        .catch((err) => {
            console.error("LIFF初期化失敗", err);
            document.getElementById("title").innerText = "エラーが発生しました";
        });
});

// URLパラメータを解析してモードを切り替える関数
function analyzeUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const contentKey = urlParams.get('content') || 'regular_class'; // 指定がない場合はデフォルトで本科授業に

    currentContent = CONTENT_SETTINGS[contentKey];

    if (currentContent) {
        // 画面の表示を切り替え
        document.getElementById("title").innerText = `${currentContent.title} の紹介`;
        document.getElementById("subtitle").innerText = "下のボタンからLINEの友だちに紹介カードを送れます";
        
        // ボタンを有効化し、クリックイベントを設定
        const shareBtn = document.getElementById("share-btn");
        shareBtn.disabled = false;
        shareBtn.addEventListener("click", sendShare);
    } else {
        document.getElementById("title").innerText = "無効なURLです";
    }
}

// ターゲットピッカーを開いてFlexメッセージを送信する関数
function sendShare() {
    if (!liff.isApiAvailable('shareTargetPicker')) {
        alert("この環境ではシェア機能が利用できません");
        return;
    }

    // 動的に作成するFlexメッセージの構造
    const flexMessage = {
        type: "flex",
        altText: `友だちから「${currentContent.title}」の紹介が届きました！`,
        contents: {
            type: "bubble",
            hero: {
                type: "image",
                url: currentContent.image,
                size: "full",
                aspectRatio: "20:13",
                aspectMode: "cover"
            },
            body: {
                type: "box",
                layout: "vertical",
                contents: [
                    {
                        type: "text",
                        text: currentContent.title,
                        weight: "bold",
                        size: "xl"
                    },
                    {
                        type: "text",
                        text: currentContent.text,
                        margin: "md",
                        wrap: true
                    }
                ]
            },
            footer: {
                type: "box",
                layout: "vertical",
                contents: [
                    {
                        type: "button",
                        action: {
                            type: "uri",
                            label: "詳細・お申し込みはこちら",
                            uri: currentContent.link
                        },
                        style: "primary",
                        color: "#06C755"
                    }
                ]
            }
        }
    };

    // ターゲットピッカーを表示
    liff.shareTargetPicker([flexMessage])
        .then((res) => {
            if (res) {
                // 送信成功（送信先を選んで送信した時）
                alert("紹介メッセージを送信しました！");
                liff.closeWindow(); // ミニアプリを閉じる
            } else {
                // ユーザーがシェアをキャンセルした時
                console.log("シェアがキャンセルされました");
            }
        })
        .catch((err) => {
            console.error("送信エラー", err);
        });
}
