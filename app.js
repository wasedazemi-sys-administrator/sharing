// 本番環境（Netlify等）やローカルサーバーからLIFF_IDを取得する想定
// ※GitHub公開時は、ここを直書きせず環境変数から注入されるようにします
const LIFF_ID = "/*liff_id_placeholder*/";

let imgBaseUrl = "https://lh3.googleusercontent.com/d/";

// 6種類のコンテンツ設定（バナー画像とテキストの定義）
const CONTENT_SETTINGS = {
    test_preparation: {
        title: "テスト対策講座",
        text: "ワセダで定期テスト対策！\n全講座無料でご招待！",
        image: imgBaseUrl + "1lELtXTftTvq9nMPXTWYcwvdYdHWbp0Ln",
        link: "https://wasedazemi-highschool.com/class_schedule/test_preparation?utm_source=social&utm_medium=line_official&utm_campaign=2026_first_semester_final_exam"        
    },
    spring_seminar: {
        title: "春期講習",
        text: "ワセダでスタートダッシュ！\n春期講習、全講座無料！",
        image: imgBaseUrl + "1ieIAKMnQcEDDIfdj-OYMeDs6_Vk3C6SV",
        link: "https://wasedazemi-highschool.com/class_schedule/seminar?utm_source=social&utm_medium=line_official&utm_campaign=2027spring"
    },
    summer_seminar: {
        title: "夏期講習",
        text: "ワセダでこの夏最強の自分へ！目指せ大学現役合格！",
        image: imgBaseUrl + "1_LDcQKTwVaPoqfvoUJZoup8i_Y96uiad",
        link: "https://wasedazemi-highschool.com/class_schedule/seminar?utm_source=social&utm_medium=line_official&utm_campaign=2026summer"
    },
    winter_seminar: {
        title: "冬期講習",
        text: "ワセダで熱い冬を！冬期講習で実力を引き上げよう！",
        image: imgBaseUrl + "1kZ_i3UyEPsY_n_49XnkZoo4rklVmyV7Q",
        link: "https://wasedazemi-highschool.com/class_schedule/seminar?utm_source=social&utm_medium=line_official&utm_campaign=2026winter"
    },
    regular_class: {
        title: "本科授業",
        text: "ワセダの授業を無料体験！一緒に大学現役合格を目指せ！",
        image: imgBaseUrl + "1s__heVe0m9WQ469BuZ057VC1tJShFGqw",
        link: "https://wasedazemi-highschool.com/class_schedule/regular?utm_source=social&utm_medium=line_official&utm_campaign=2026trial"
    },
    event: {
        title: "特別イベント",
        text: "ワセダで特別イベント開催！友だちと一緒に参加しよう！",
        image: imgBaseUrl + "1SSLtPsj4HDObgWfpI8jpAvIiZH1II6p7",
        link: "https://wasedazemi-highschool.com/event/twelfth_grade_special_event?utm_source=social&utm_medium=line_official&utm_campaign=2026_twelfth_grade_special_event"
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

    const flexMessage = {
        type: "flex",
        altText: `生徒第一主義：早稲田ゼミから「${currentContent.title}」の紹介が届きました！`,
        contents: {
            type: "bubble",
            hero: {
                type: "image",
                url: currentContent.image,
                size: "full",
                aspectRatio: "20:13",
                aspectMode: "cover",
                // 👇 ここから追加：画像タップ時の動作を設定
                action: {
                    type: "uri",
                    uri: currentContent.link
                }
                // 👆 ここまで追加
            },
            body: {
                type: "box",
                layout: "vertical",
                contents: [
                    {
                        type: "text",
                        text: "生徒第一主義",
                        size: "sm",
                        color: "#005CB9",
                        weight: "bold",
                        margin: "none"
                    },
                    {
                        type: "text",
                        text: currentContent.title,
                        weight: "bold",
                        size: "xl",
                        color: "#005CB9",
                        margin: "xs"
                    },
                    {
                        type: "text",
                        text: currentContent.text,
                        margin: "md",
                        wrap: true,
                        lineSpacing: "4px",
                        size: "md"
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

    liff.shareTargetPicker([flexMessage])
        .then((res) => {
            if (res) {
                alert("紹介メッセージを送信しました！");
                liff.closeWindow(); 
            }
        })
        .catch((err) => {
            console.error("送信エラー", err);
        });
}
