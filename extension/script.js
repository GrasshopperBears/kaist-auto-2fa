const KAIST_OTP_URL = "https://iam2.kaist.ac.kr/#/checkOtp";

let requested = false;
let answered = false;

const notifyUser = () => {
  document.querySelector("input[type='password']").style =
    "background-color: black; color: white;";
};

const requestCode = async (url) => {
  if (requested) return null;

  requested = true;
  const response = await fetch(url);
  const { code } = await response.json();

  if (code !== null) {
    answered = true;
    await navigator.clipboard.writeText(code);
    notifyUser();
  } else {
    requested = false;
  }
};

const main = async () => {
  if (!window.location.href.startsWith(KAIST_OTP_URL)) return;
  if (!document.getElementById("email")) return setTimeout(main, 200);

  document.getElementById("email").click();
  chrome.storage.sync.get(["url"], (values) => {
    if (!values.url) return;

    const url = values.url;
    const interval = setInterval(() => {
      if (answered) clearTimeout(interval);
      requestCode(url);
    }, 1000);
  });
};

main();
window.addEventListener("locationchange", main);
