// Define interfaces for the data structure
export interface Event {
  year: number;
  description: string;
}

export interface TimePeriod {
  startYear: number;
  endYear: number;
  title: string; // Title for the time period, e.g., "Наука"
  events: Event[];
}

// Sample data for the timeline component
export const timelineData: TimePeriod[] = [
  {
    startYear: 2015,
    endYear: 2022,
    title: "Наука",
    events: [
      { year: 2015, description: "13 сентября частное солнечное затмение, видимое в Южной Африке и части Антарктиды" },
      { year: 2016, description: "Телескоп «Хаббл» обнаружил самую удалённую из всех обнаруженных галактик, получившую обозначение GN-z11" },
      { year: 2017, description: "Компания Tesla официально представила первый в мире электрический грузовик Tesla Semi" },
      { year: 2018, description: "Запуск космического телескопа Джеймс Уэбб" },
      { year: 2019, description: "Первое изображение черной дыры получено проектом Event Horizon Telescope" },
      { year: 2020, description: "Марсоход Perseverance успешно приземлился на Марсе" },
      { year: 2021, description: "Запуск космического телескопа Джеймс Уэбб (перенос)" }, // Corrected year based on actual launch
      { year: 2022, description: "Телескоп Джеймс Уэбб начал научные операции" },
    ],
  },
  {
    startYear: 1900,
    endYear: 1950,
    title: "Искусство",
    events: [
      { year: 1905, description: "Выход первой части «В поисках утраченного времени» Марселя Пруста" },
      { year: 1913, description: "Премьера балета «Весна священная» Игоря Стравинского" },
      { year: 1924, description: "Создание сюрреализма Андре Бретоном" },
    ],
  },
    {
    startYear: 1800,
    endYear: 1850,
    title: "История",
    events: [
      { year: 1812, description: "Отечественная война 1812 года" },
      { year: 1825, description: "Восстание декабристов" },
      { year: 1837, description: "Дуэль и смерть А.С. Пушкина" },
    ],
  },
  {
    startYear: 1994,
    endYear: 2015,
    title: "Тест",
    events: [
      { year: 1905, description: "Выход первой части «В поисках утраченного времени» Марселя Пруста" },
      { year: 1913, description: "Премьера балета «Весна священная» Игоря Стравинского" },
      { year: 1924, description: "Создание сюрреализма Андре Бретоном" },
    ],
  },
  {
    startYear: 1994,
    endYear: 2015,
    title: "Тест 3",
    events: [
      { year: 1905, description: "Выход первой части «В поисках утраченного времени» Марселя Пруста" },
      { year: 1913, description: "Премьера балета «Весна священная» Игоря Стравинского" },
      { year: 1924, description: "Создание сюрреализма Андре Бретоном" },
    ],
  },
  {
    startYear: 1994,
    endYear: 2015,
    title: "Тест 4",
    events: [
      { year: 1905, description: "Выход первой части «В поисках утраченного времени» Марселя Пруста" },
      { year: 1913, description: "Премьера балета «Весна священная» Игоря Стравинского" },
      { year: 1924, description: "Создание сюрреализма Андре Бретоном" },
    ],
  },
];

// You can add more data sets here for testing the independence of the component
// export const anotherTimelineData: TimePeriod[] = [ ... ];
