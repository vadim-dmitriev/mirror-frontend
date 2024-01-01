<template>
  <div ref="wrapper" class="wrapper">
    <div class="calendar">
      <table>
        <tr>
          <td v-for="(dayOfWeek, idx) in daysOfWeek" :key="idx" class="day-of-week-cell">
            {{ dayOfWeek }}
          </td>
        </tr>
      </table>
      <table class="days">
        <tr v-for="(week, idx) in monthDays" :key="idx">
          <td v-for="(day, idxx) in week" :key="idxx" v-bind:class="dayClass(day)">
            {{ day }}
          </td>
        </tr>
      </table>
    </div>
    <div class="events">
      <div v-for="(event, idx) in events" :key="idx" class="event">
        {{ event.title }}
      </div>
    </div>
  </div>
</template>

<script>
  import { BackendHost } from '../App.vue'

  const componentName = "Calendar";

  export default {
    name: componentName,
    data() {
      return {
        currentDate: new Date(),
        daysOfWeek: ["пн", "вт", "ср", "чт", "пт", "сб", "вс"],
        monthsNames: ["январь", "январь", "январь", "январь"],
        monthDays: null,
        events: null,
      };
    },
    mounted: async function () {
      this.updateEvents();
      setInterval(this.updateEvents, 1 * 60 * 1000);

      this.monthDays = this.createMonthDays();

    },
    methods: {
      updateEvents: async function () {
        let response = await fetch(`http://${BackendHost}:8081/calendar`);

        if (response.status == 200) {
          let json = await response.json();

          this.setEvents(json.events);
        }
      },
      setEvents: function (events) {
        this.events = events;
      },
      createMonthDays: function () {
        let firstDayOfMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 0)

        let maxDaysInMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth()+1, 0).getDate();

        let days = [];
        let currentDay = 1;
        let i = 0;

        for (;;) {
          if (currentDay > maxDaysInMonth) {
            break
          }

          let weekArray = days[Math.floor(i/7)];
          if (!weekArray) {
            days[Math.floor(i/7)] = [];
            weekArray = days[Math.floor(i/7)];
          }

          i++;

          if (i <= firstDayOfMonth.getDay()) {
            weekArray.push(null);
            continue
          }

          weekArray.push(currentDay);
          currentDay++;
        }

        return days
      },
      dayClass: function (day) {
        if (day == this.currentDate.getDate()) {
          return "calendar-cell today"
        }
        return "calendar-cell"
      }
    }
  }
</script>

<style scoped>
  .wrapper {
    position: absolute;
    top: 500px;
    right: 50px;
  }

  .calendar {
    text-align: center; 
    font-size: 24px;
  }

  .day-of-week-cell {
    padding: 10px;
  }

  .days {}

  .calendar-cell {
    padding: 10px;
    margin: 0 auto;
  }

  .today {
    border: 2px solid white;
    border-radius: 50px;
  }

  .events {
    font-size: 20px;
  }

  .event {
    padding-top: 10px;
  }
</style>
