import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const btn = document.querySelector('[data-start]');
const input = document.querySelector('#datetime-picker');
let userSelectedDate = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
      btn.setAttribute("disabled", "disabled");
      selectedDates[0].getTime() < Date.now()
        ? iziToast.error({
            title: "Error",
            message: "Please choose a date in the future"
          })
          : btn.removeAttribute("disabled");
      userSelectedDate = selectedDates[0].getTime();
   },
};

flatpickr("#datetime-picker", options);

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
function addLeadingZero(value) {
    return value.toString().padStart(2, '0');
}

btn.addEventListener("click", () => {
    btn.setAttribute("disabled", "disabled");
    input.setAttribute("disabled", "disabled");
    const timerId = setInterval(() => {
        const currentDate = Date.now();
        const timeDifference = userSelectedDate - currentDate;

        if (timeDifference <= 0) {
            clearInterval(timerId);
            btn.removeAttribute("disabled");
            input.removeAttribute("disabled");

            return;
        }
      
        const { days, hours, minutes, seconds } = convertMs(timeDifference);
        document.querySelector('[data-days]').textContent = addLeadingZero(days);
        document.querySelector('[data-hours]').textContent = addLeadingZero(hours);
        document.querySelector('[data-minutes]').textContent = addLeadingZero(minutes);
        document.querySelector('[data-seconds]').textContent = addLeadingZero(seconds);
    }, 1000);
});