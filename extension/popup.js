chrome.storage.sync.get(["url"], (values) => {
  if (values.url) document.getElementById("url-input").value = values.url;
});

const saveUrl = () => {
  const inputUrl = document.getElementById("url-input").value;
  chrome.storage.sync.set({ url: inputUrl });
  console.log("set", inputUrl);
};

document.getElementById("set-url").onclick = saveUrl;
