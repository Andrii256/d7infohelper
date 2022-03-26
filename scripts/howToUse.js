(function () {
  const wrapper = document.querySelector("#howToUse-wrapper");
  const toggler = document.querySelector("#howToUse-toggler");
  const content = document.querySelector("#howToUse-content");

  const classWhenOpened = "howToUse--opened";

  toggler.addEventListener("click", () => {
    if (wrapper.classList.contains(classWhenOpened)) {
      wrapper.classList.remove(classWhenOpened);
    } else {
      wrapper.classList.add(classWhenOpened);
    }
  });
})();
