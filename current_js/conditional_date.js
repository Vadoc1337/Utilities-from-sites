/* 
!Образец добавления объявления на сайт при наступлении определенного времени
//*Date (year, month, day, hours, minutes, seconds, milliseconds);
//*В месяцах 0 - январь 5- апрель 11- декабрь; если юзаем стандартный js !!!
//*Здесь использую библиотеку moment js для установки локального времени в Новосибирске.

const announcementString = `
    <div id="services-announcement" class="services-item item-0 clearfix col-xs-14 col-sm-14 col-md-14 col-xl-14">
        <div class="services-item-inner" id="announcement-padding-style">
            <div class="icon_wrap">
                <div class="services-macros">
                    <div class="service-icon">
                        <h2 id="announcement">
                            НОТАРИАЛЬНАЯ КОНТОРА НЕ РАБОТАЕТ С 30.12.2023 по 09.01.2024
                        </h2>
                    </div>
                </div>
            </div>
        </div>
    </div>`;


const startDateOfAnnouncement = moment
    .tz("2023-12-29 09:00:00", "Asia/Novosibirsk")
    .valueOf();



const expiredDateOfAnnouncement = moment
    .tz("2024-01-10 00:00:00", "Asia/Novosibirsk")
    .valueOf();

if (
    currentDateInNovosibirsk >= startDateOfAnnouncement &&
    currentDateInNovosibirsk <= expiredDateOfAnnouncement
) {
    const announce = document.getElementById("announcement_block");
    announce.insertAdjacentHTML("afterend", announcementString);
}
 */

//* Функция реализации динамической смены даты копирайта в футере сайта
const currentDateInNovosibirsk = moment.tz("Asia/Novosibirsk").valueOf();
const currentYear = moment().tz("Asia/Novosibirsk").year();
const startYear = 2023;
const endYear = 2045;

for (let year = startYear; year <= endYear; year++) {
    const newYear = moment
        .tz(`${year}-01-01 00:00:00`, "Asia/Novosibirsk")
        .valueOf();

    if (currentDateInNovosibirsk >= newYear) {
        const footer_date = document.getElementById("footer_date");
        footer_date.textContent = "";
        footer_date.insertAdjacentText("beforeend", year);
    }
}
