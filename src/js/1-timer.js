import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const btn = document.querySelector('[data-start]');
const input = document.querySelector('#datetime-picker');
let userSelectedDate = null;

btn.disabled = true;

const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,

    onClose(selectedDates) {
        btn.disabled = true;

        userSelectedDate = selectedDates[0].getTime();

        if (userSelectedDate <= Date.now()) {
            iziToast.error({
                title: "Error",
                message: "Please choose a date in the future",
            });
        } else {
            btn.disabled = false;
        }
    },
};

flatpickr("#datetime-picker", options);

function convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
    return value.toString().padStart(2, "0");
}

btn.addEventListener("click", () => {
    btn.disabled = true;
    input.disabled = true;

    const timerId = setInterval(() => {
        const currentDate = Date.now();
        const timeDifference = userSelectedDate - currentDate;

        if (timeDifference <= 0) {
            clearInterval(timerId);

            // После окончания таймера:
            input.disabled = false;
            btn.disabled = true;

            return;
        }

        const { days, hours, minutes, seconds } = convertMs(timeDifference);

        document.querySelector('[data-days]').textContent =
            addLeadingZero(days);

        document.querySelector('[data-hours]').textContent =
            addLeadingZero(hours);

        document.querySelector('[data-minutes]').textContent =
            addLeadingZero(minutes);

        document.querySelector('[data-seconds]').textContent =
            addLeadingZero(seconds);
    }, 1000);
});