console.log('Hello');
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

// Знаходимо DOM-елементи
const startBtn = document.querySelector('[data-start]');
const dateInput = document.querySelector('#datetime-picker');

const daysEl = document.querySelector('[data-days]');
const hoursEl = document.querySelector('[data-hours]');
const minutesEl = document.querySelector('[data-minutes]');
const secondsEl = document.querySelector('[data-seconds]');

let selectedTime = null; // Вибрана дата користувачем
let countdownInterval = null; // ID інтервалу, щоб зупиняти при потребі

// Деактивуємо кнопку на старті
startBtn.disabled = true;

// Ініціалізація flatpickr з опціями
flatpickr(dateInput, {
  enableTime: true, // Дозволяє вибір часу
  time_24hr: true, // Формат 24-годинний
  defaultDate: new Date(), // Поточна дата
  minuteIncrement: 1, // Крок вибору хвилин
  onClose(selectedDates) {
    // Коли користувач вибрав дату
    const pickedDate = selectedDates[0];
    const now = new Date();

    if (pickedDate <= now) {
      // Якщо дата в минулому — показуємо помилку
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
      startBtn.disabled = true;
    } else {
      // Якщо дата коректна — активуємо кнопку
      selectedTime = pickedDate;
      startBtn.disabled = false;
    }
  },
});

// Обробник кнопки старту
startBtn.addEventListener('click', () => {
  if (!selectedTime) return;

  startBtn.disabled = true;
  dateInput.disabled = true; // Забороняємо зміну дати під час відліку

  countdownInterval = setInterval(() => {
    const now = new Date();
    const diff = selectedTime - now;

    if (diff <= 0) {
      clearInterval(countdownInterval);
      updateTimerDisplay(0);
      iziToast.success({
        title: 'Done!',
        message: 'Countdown completed 🎉',
        position: 'topRight',
      });
      return;
    }

    updateTimerDisplay(diff);
  }, 1000);
});

// Оновлення DOM значень (днів, годин, хвилин, секунд)
function updateTimerDisplay(ms) {
  const { days, hours, minutes, seconds } = convertMs(ms);

  daysEl.textContent = addLeadingZero(days);
  hoursEl.textContent = addLeadingZero(hours);
  minutesEl.textContent = addLeadingZero(minutes);
  secondsEl.textContent = addLeadingZero(seconds);
}

// Конвертація мілісекунд у дні, години, хвилини, секунди
function convertMs(ms) {
  const sec = 1000;
  const min = sec * 60;
  const hour = min * 60;
  const day = hour * 24;

  return {
    days: Math.floor(ms / day),
    hours: Math.floor((ms % day) / hour),
    minutes: Math.floor((ms % hour) / min),
    seconds: Math.floor((ms % min) / sec),
  };
}

// Функція для додавання ведучого нуля (наприклад 08 замість 8)
function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}
