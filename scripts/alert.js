(function () {
  const showAlert = (html, timeout) => {
    const alert = document.querySelector("#alert");

    alert.innerHTML = html;
    alert.style.display = "block";
    setTimeout(() => {
      alert.style.opacity = "1";
    }, 0);

    clearTimeout(+alert.dataset.timeout);

    alert.dataset.timeout = setTimeout(() => {
      alert.style.opacity = "0";
      clearTimeout(+alert.dataset.timeout);
      setTimeout(() => (alert.style.display = "none"), 20);
    }, timeout ?? 1500);
  };

  window.alert = showAlert;
})();
