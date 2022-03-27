(function () {
  const getSeparateAccounts = (string) => {
    return string.split("\n").map((row) => {
      if (row.includes("twitter.com/")) {
        return `@${row.split("twitter.com/")[1]}`;
      } else if (row.includes("instagram.com/")) {
        return `@${row.split("instagram.com/")[1]}`;
      } else if (row.includes("facebook.com/")) {
        return `@${row.split("facebook.com/")[1]}`;
      } else {
        return row;
      }
    });
  };

  const getBundleAccounts = (string, maxCharacters) => {
    const rawAccounts = getSeparateAccounts(string);
    const accounts = [[]];

    let currentAccIndex = 0;
    for (let account of rawAccounts) {
      if (
        [...accounts[currentAccIndex], account].join(", ").length <=
        maxCharacters
      ) {
        accounts[currentAccIndex].push(account);
      } else {
        accounts.push([]);
        currentAccIndex++;
        accounts[currentAccIndex].push(account);
      }
    }

    return accounts;
  };

  const getAccounts = () => {
    const accountsElem = document.querySelector("#input-accounts");
    const algorithm = document.querySelector("#algorithm-option-oneByOne")
      .checked
      ? "one by one"
      : "bundle";
    const messageLength = document
      .querySelector("#input-rawMessage")
      .value.split("\\\\nickname\\\\")
      .join("").length;

    switch (algorithm) {
      case "one by one":
        return getSeparateAccounts(accountsElem.value);
      case "bundle":
        return getBundleAccounts(accountsElem.value, 280 - messageLength);
      default:
        throw new Error("incorrect algorithm of accounts creation");
    }
  };

  const accountToString = (account) =>
    typeof account === "string" ? account : account.join(", ");

  const generateHTMLforNicknamesList = (accounts, startIndex) =>
    accounts
      .slice(startIndex, startIndex + 5)
      .map(
        (account, index) =>
          `<li class="nicknamesList__nickname${
            index === 0 ? " nicknamesList__nickname--active" : ""
          }">${accountToString(account)}</li>`,
      )
      .join("\n");

  const getStartIndex = (max) => {
    const possibleStartIndex =
      +document.querySelector("#nicknamesList").dataset.activeIndex;

    return possibleStartIndex <= max ? possibleStartIndex : 0;
  };

  const updateNavigationList = (accounts) => {
    const startIndex = getStartIndex(accounts.length);
    const htmlForList = generateHTMLforNicknamesList(accounts, startIndex);

    document.querySelector("#nicknamesList").innerHTML = htmlForList;
  };

  const generateNewMessage = (account) => {
    const template = document.querySelector("#input-rawMessage").value;

    return template.split("\\\\nickname\\\\").join(accountToString(account));
  };

  const updateMessage = (newValue) =>
    (document.querySelector("#output-compiledMessage").value = newValue);

  let accounts = getAccounts();

  const updateEverything = () => {
    accounts = getAccounts();
    const startIndex = getStartIndex(accounts.length);
    const currentAccount = accounts[startIndex];
    const message = generateNewMessage(currentAccount);

    updateMessage(message);
    updateNavigationList(accounts);
  };

  const updatePrevButton = (currentIndex) => {
    const buttonPrev = document.querySelector("#outbuton-buttonPrev");
    if (currentIndex === 0) {
      buttonPrev.disabled = true;
    } else {
      buttonPrev.disabled = false;
    }
  };

  const updateNextButton = (currentIndex) => {
    const buttonNext = document.querySelector("#outbuton-buttonNext");
    if (currentIndex >= accounts.length) {
      buttonNext.disabled = true;
    } else {
      buttonNext.disabled = false;
    }
  };

  const increaseStartIndex = () => {
    const index = 1 + getStartIndex(accounts.length);

    if (index > accounts.length) {
      return;
    }

    document.querySelector("#nicknamesList").dataset.activeIndex = index;

    updatePrevButton(index);
    updateNextButton(index);
    updateEverything();
  };

  const decreaseStartIndex = () => {
    const index = getStartIndex(accounts.length) - 1;

    document.querySelector("#nicknamesList").dataset.activeIndex = index;

    updatePrevButton(index);
    updateNextButton(index);
    updateEverything();
  };

  const copy = () => {
    const text = document.querySelector("#output-compiledMessage").value;

    if (window.copyToClipboard(text)) {
      alert("✅ Copied", 70);
    } else {
      alert(
        "❌ Something went wrong <br/>Please use another browser or copy text by hand",
        2500,
      );
    }
  };

  updateEverything();

  document
    .querySelector("#input-accounts")
    .addEventListener("input", updateEverything);

  document
    .querySelector("#algorithm-option-oneByOne")
    .addEventListener("change", updateEverything);

  document
    .querySelector("#algorithm-option-bundle")
    .addEventListener("change", updateEverything);

  document
    .querySelector("#input-rawMessage")
    .addEventListener("input", updateEverything);

  document
    .querySelector("#outbuton-buttonNext")
    .addEventListener("click", increaseStartIndex);

  document
    .querySelector("#outbuton-buttonPrev")
    .addEventListener("click", () => {
      if (!document.querySelector("#outbuton-buttonPrev").disabled) {
        decreaseStartIndex();
      }
    });

  document.querySelector("#outbuton-copy").addEventListener("click", copy);

  document
    .querySelector("#outbuton-nextAndBody")
    .addEventListener("click", () => {
      copy();

      increaseStartIndex();
    });
})();
