"use strict";
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("form");
    form.addEventListener("submit", formSend);

    async function formSend(e) {
        e.preventDefault();
        let error = formValidate(form);

        let formData = new FormData(form);

        if (error === 0) {
            form.classList.add("_sending");
            let response = await fetch("/mailer/sendmail.php", {
                method: "POST",
                body: formData,
            });
            if (response.ok) {
                let result = await response.json();
                alert(result.message);
                // Очистка формы
                form.reset();
                form.classList.remove("_sending");
                // Удаление элементов списка загруженных файлов
                let downloadedFiles =
                    document.querySelector(".downloadedFiles");
                if (downloadedFiles) {
                    let listItems = document.querySelectorAll(".list li");
                    listItems.forEach((li) => li.remove());
                    // Переместить содержимое
                    downloadedFiles.parentNode.insertBefore(
                        existingCode,
                        downloadedFiles
                    );
                    // Удалить контейнер
                    downloadedFiles.remove();
                    listSection.style.display = "none";
                }
            } else {
                alert("Ошибка отправки данных");
                form.classList.remove("_sending");
            }
        }
    }

    function formValidate(form) {
        let error = 0;
        let formReq = document.querySelectorAll("._req");

        for (let index = 0; index < formReq.length; index++) {
            const input = formReq[index];
            formRemoveError(input);
            if (input.value.trim() === "") {
                formAddError(input);
                error++;
            }
        }
        return error;
    }
    // Красная подсветка, но работает это только на компьютере, но не на мобилках
    function formAddError(input) {
        input.parentElement.classList.add("_error");
        input.classList.add("_error");
    }
    function formRemoveError(input) {
        input.parentElement.classList.remove("_error");
        input.classList.remove("_error");
    }
});

////////////////////////////////////////////////////* Код для отправки файла методом XHR *//////////////////////////////////////////////////////

const listSection = document.querySelector(".list-section");
const listContainer = document.querySelector(".list");
const fileButton = document.querySelector(".file__button");
const fileButtonInput = document.querySelector(".file__input");
const existingCode = document.querySelector(".col");

// upload files with browse button
fileButton.onclick = () => {
    fileButtonInput.click();
};

fileButtonInput.onchange = () => {
    [...fileButtonInput.files].forEach((file) => {
        if (typeValidation(file.type)) {
            uploadFile(file);
        }
    });
};

// check the file type
function typeValidation(type) {
    var splitType = type.split("/")[0];
    if (
        type == "application/pdf" ||
        type == "application/msword" ||
        type ==
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        type == "text/plain" ||
        splitType == "image"
    ) {
        return true;
    }
}

// upload file function
function uploadFile(file) {
    if (file.size > 10 * 1024 * 1024) {
        alert("Файл должен быть менее 10 мБ. ");
        return;
    }

    listSection.style.display = "block";

    // Create a new div element
    const newContainer = document.createElement("div");

    // Set the class of the new div
    newContainer.className = "downloadedFiles";

    // Insert the new div before the existing code
    existingCode.parentNode.insertBefore(newContainer, existingCode);

    // Move the existing code into the new div
    newContainer.appendChild(existingCode);

    const li = document.createElement("li");
    li.classList.add("in-prog");
    li.innerHTML = `
        <div class="col">
        <img src="/mailer/my-icons/${iconSelector(
            file.type
        )}" alt="Загруженный файл">
        </div>
        <div class="col">
            <div class="file-name">
                <div class="name">${file.name}</div>
                <span>0%</span>
            </div>
            <div class="file-progress">
                <span></span>
            </div>
            <div class="file-size">${(file.size / (1024 * 1024)).toFixed(
                2
            )} MB</div>
        </div>
        <div class="col">
            <svg xmlns="http://www.w3.org/2000/svg" class="cross" height="20" width="20"><path d="m5.979 14.917-.854-.896 4-4.021-4-4.062.854-.896 4.042 4.062 4-4.062.854.896-4 4.062 4 4.021-.854.896-4-4.063Z"/></svg>
            <svg xmlns="http://www.w3.org/2000/svg" class="tick" height="20" width="20"><path d="m8.229 14.438-3.896-3.917 1.438-1.438 2.458 2.459 6-6L15.667 7Z"/></svg>
        </div>
    `;
    listContainer.prepend(li);

    var http = new XMLHttpRequest();
    var data = new FormData();
    data.append("file", file);
    http.onload = () => {
        li.classList.add("complete");
        li.classList.remove("in-prog");
    };
    http.upload.onprogress = (e) => {
        var percent_complete = (e.loaded / e.total) * 100;
        li.querySelectorAll("span")[0].innerHTML =
            Math.round(percent_complete) + "%";
        li.querySelectorAll("span")[1].style.width = percent_complete + "%";
    };
    http.open("POST", "/mailer/sender.php", true);
    http.send(data);
    li.querySelector(".cross").onclick = () => http.onabort();
    http.onabort = () => {
        deleteFile(file.name);
        li.remove();
        let listItems = document.querySelectorAll(".list li");
        if (listItems.length === 0) {
            let downloadedFiles = document.querySelector(".downloadedFiles");
            if (downloadedFiles) {
                // Переместить содержимое
                downloadedFiles.parentNode.insertBefore(
                    existingCode,
                    downloadedFiles
                );
                // Удалить контейнер
                downloadedFiles.remove();
                listSection.style.display = "none";
            }
        }
    };
    function deleteFile(blobName) {
        let xhr = new XMLHttpRequest();

        // данные для передачи
        let deletedData = new FormData();
        deletedData.append("file", blobName);
        deletedData.append("delete", true);

        xhr.open("POST", "/mailer/delete-files.php");

        xhr.onload = () => {
            if (xhr.status === 200) {
                // удаление прошло успешно
                console.log("File deleted", blobName);
            }
        };

        xhr.send(deletedData);
    }
}
// find icon for file
function iconSelector(type) {
    var splitType =
        type.split("/")[0] == "application" || type.split("/")[0] == "text"
            ? type.split("/")[1]
            : type.split("/")[0];
    return splitType + ".png";
}
