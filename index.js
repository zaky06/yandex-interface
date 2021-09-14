"use strict";

((global) => {
  const timeout = 20;

  const _async = (fn, cb) => {
    setTimeout(() => {
      cb(fn());
    }, Math.random() * timeout);
  };

  const Folder = function (a = []) {
    if (!new.target) {
      return new Folder(a);
    }

    this.read = (index, cb) => _async(() => a[index], cb);
    this.size = (cb) => _async(() => a.length, cb);
  };

  Object.freeze(Folder);
  global.Folder = Folder;
})(typeof window === "undefined" ? global : window);

const input = Folder([
  "file",
  "ffffile",
  Folder(["file"]),
  Folder(["fiiile"]),
  Folder([{}, null, "file", "ffiillee", "ffiillee"]),
  Folder([Folder(["filllle", "file", null]), {}, Folder([])]),
]);

// проверка решения
solution(input).then((result) => {
  const answer = ["ffffile", "ffiillee", "ffiillee", "fiiile", "filllle"];
  const isEqual = String(answer) === String(result);

  if (isEqual) {
    console.log("OK");
  } else {
    console.log("WRONG");
  }
});

// Пример рекурсии
const updateString = (argument) => {
  // file
  if (!argument.length) {
    return;
  }

  // folder
  if (!!argument.length) {
    for (let i = 0; i < argument.length; i++) {
      updateString(argument[i]);
    }
  }
};

// DRY - DON'T REPEAT YOUSELF
async function solution(input) {
  // ... решение задачи
  let result = [];

  function asyncRead(file, index) {
    return new Promise((resolve) => {
      file.read(index, resolve);
    });
  }

  function asyncGetSize(file) {
    return new Promise((resolve) => {
      file.size(resolve);
    });
  }

  const processingFiles = async (file) => {
    if (file !== null && Object.keys(file).length !== 0 && file !== undefined) {
      if (!file.size && file !== "file") {
        result.push(file);
      }

      if (!!file.size) {
        const size = await asyncGetSize(file);
        for (let i = 0; i < size; i++) {
          const currentFile = await asyncRead(file, i);
          await processingFiles(currentFile);
        }
      }
    }
  };

  await processingFiles(input);

  return result.sort();
}
