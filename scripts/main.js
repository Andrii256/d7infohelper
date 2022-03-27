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

  const generateHTMLforNicknamesList = (accounts, startIndex) =>
    accounts
      .slice(startIndex, startIndex + 5)
      .map(
        (account, index) =>
          `<li class="nicknamesList__nickname${
            index === 0 ? " nicknamesList__nickname--active" : ""
          }">${account}</li>`,
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

  let accounts = getAccounts();

  document
    .querySelector("#input-accounts")
    .addEventListener("input", (event) => {
      accounts = getAccounts();

      updateNavigationList(accounts);
    });
})();
