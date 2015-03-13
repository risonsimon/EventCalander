/*
 * Contains code for generating event calender with month and day views.
 * The events are taken from calenderEvents in settings object.
 * Created by Rison.
 * https://github.com/risonsimon/EventCalander
 */

(function() {
    var todayDate = new Date();
// Settings object which contains the event list and other common items.
    var settings = {
        calenderEvents: [
            {
                name: "Product Workshop",
                description: "Product workshop will help to find more about the product.",
                startTime: "03/12/2015 11:05 AM",
                endTime: "03/12/2015 04:00 PM"
            },
            {
                name: "Product 2 Workshop",
                description: "Product 2 workshop will help to find more about the product 2.",
                startTime: "03/12/2015 11:00 AM",
                endTime: "03/12/2015 07:00 PM"
            }
            ,
            {
                name: "Product Demo",
                description: "Product demo will help you to understand product features better.",
                startTime: "02/13/2015 10:00 AM",
                endTime: "02/13/2015 12:00 PM"
            },
            {
                name: "Product Demo Part 2",
                description: "Product demo will help you to understand product features better.",
                startTime: "03/14/2015 02:00 PM",
                endTime: "03/14/2015 04:00 PM"
            },
            {
                name: "Product Demo Part 3 Happening Today",
                description: "Product demo will help you to understand product features better.",
                startTime: "03/14/2015 05:00 PM",
                endTime: "03/14/2015 06:00 PM"
            },
            {
                name: "Product Demo Part 4",
                description: "Product demo will help you to understand product features better.",
                startTime: "03/14/2015 06:00 PM",
                endTime: "03/14/2015 07:00 PM"
            },
            {
                name: "Product Discussion",
                description: "Discussion with customers on how to help them more.",
                startTime: "03/20/2015 10:00 AM",
                endTime: "03/20/2015 12:00 PM"
            }
        ],
        calDays: [],
        calEventDays: [],
        selectedMonth: todayDate.getMonth() + 1,
        selectedYear: todayDate.getFullYear(),
        selectedDateDay: todayDate.getDate()
    };

// Constructor for a day. A day can have a date and have events.
    var calDay = function (date,fullDate) {
        this.date = date;
        this.fullDate = fullDate;
        this.events = [];
    };

    var generateCalDays = function(month, year){
        settings.calDays = [];
        settings.calEventDays = [];
        var numberOfDays = [31, 0, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        var oDate = new Date(year, month - 1, 1); //DD replaced line to fix date bug when current day is 31st
        oDate.day = oDate.getDay() + 1; //DD replaced line to fix date bug when current day is 31st

        numberOfDays[1] = (((oDate.getFullYear() % 100 != 0) && (oDate.getFullYear() % 4 == 0)) || (oDate.getFullYear() % 400 == 0)) ? 29 : 28;
        for (i = 1; i <= 42; i++) {
            if ((i - oDate.day >= 0) && (i - oDate.day < numberOfDays[month - 1]))
                var thisCalDay = i - oDate.day + 1;
            else
                continue;
            // Create the day object.
            var fullDate = new Date(year,month-1,thisCalDay);
            var day = new calDay(thisCalDay,fullDate);
            // Get the events for the date and add them to the day object.
            var isEvents = (function () {
                var eventsPresent = false;
                for (var i = 0, len = settings.calenderEvents.length; i < len; i++) {
                    var startDate = new Date(settings.calenderEvents[i].startTime).getDate();
                    var startMonth = new Date(settings.calenderEvents[i].startTime).getMonth() + 1;
                    var startYear = new Date(settings.calenderEvents[i].startTime).getFullYear();
                    if (startDate === parseInt(thisCalDay, 10) && startMonth === month && startYear === year) {
                        day.events.push(settings.calenderEvents[i]);
                        eventsPresent = true;
                    }
                }
                return eventsPresent;
            })();

            if (isEvents) {
                settings.calEventDays.push(day);
            }
            settings.calDays.push(day);
        }
    };

    var buildDayCal = function () {
        var formatAMPM = function (date) {
            var hours = date.getHours();
            var minutes = date.getMinutes();
            var ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? '0'+minutes : minutes;
            return hours + ':' + minutes + ' ' + ampm;
        };
        var date = new Date(settings.selectedYear,settings.selectedMonth-1,settings.selectedDateDay);
        var dateStart = new Date(date.getFullYear(),date.getMonth(),date.getDate());
        var dateEnd = new Date(date.getFullYear(),date.getMonth(),date.getDate()+1);
        var eventHTML ='<div class="eventDays">';
        var leftWidth = 8;
        for(var j = 0,len = settings.calEventDays.length;j<len;j++) {
            if (settings.calEventDays[j].fullDate.getMonth() === date.getMonth() &&
                settings.calEventDays[j].fullDate.getDate() === date.getDate()) {
                for (var i = 0, len1 = settings.calEventDays[j].events.length; i < len1; i++) {
                    var startTime = new Date(settings.calEventDays[j].events[i].startTime);
                    var endTime = new Date(settings.calEventDays[j].events[i].endTime);

                    // calculating height and width.
                    var topHeight = (100/48)* ((startTime - dateStart )/1800000);
                    var itemHeight = (100/48)* ((endTime - startTime)/1800000);
                    var itemWidth = 92/len1;
                    var duration =settings.calEventDays[j].events[i].startTime.substr(10,9)+
                        ' to '+settings.calEventDays[j].events[i].endTime.substr(11,9);
                    eventHTML += '<div class="eventDay" style="top:'+ topHeight +
                    '%;height:'+itemHeight+'%;width:'+itemWidth+'%;left:'+leftWidth+'%;" data-description="'+settings.calEventDays[j].events[i].description+
                    '" data-heading="'+settings.calEventDays[j].events[i].name+
                    '" data-duration="'+duration + '">' +
                    settings.calEventDays[j].events[i].name+
                    '</div>';
                    leftWidth += itemWidth;
                }
            }
        }
        eventHTML +='</div>';
        var html = '<div class="btn-group col-lg-offset-4" role="group">' +
            '<button type="button" class="btn btn-default" id="btnDayPrev">' +
            '<span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>Prev</button>' +
            '</button> ' +
            '<button type="button" class="btn btn-danger"> '+
            date.toDateString()+
            '<button type="button" class="btn btn-default" id="btnDayNext">Next' +
            '<span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span></button>' +
            '</div>'+
            '<div class="tableDay">' +
            '<table class="table table-condensed">' ;

        while(dateEnd.getDate()!==dateStart.getDate()){
            html += '<tr class="dateTimeTr">' +
            '<td>' +
            '<div class="dateTime">' +
            formatAMPM(dateStart) +
            '</div>' +
            '</td>' +
            '</tr>';
            dateStart=new Date(dateStart.getTime()+1800000);
        }

        html += eventHTML + '</table></div>';
        return html;
    };

    // For generating monthly calender
    var buildMonthCal = function(dayClass, dateClass) {
        var monthArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        var daysWeek = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
        var calenderHtml =
            '<div class="btn-group col-lg-offset-4" role="group">' +
            '<button type="button" class="btn btn-default" id="btnMonthPrev"> ' +
            '<span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>Prev</button>' +
            '<button class="monthHeading btn btn-warning text-center">' + monthArray[settings.selectedMonth - 1] + ' - ' + settings.selectedYear + '</button>' +
            '<button type="button" class="btn btn-default" id="btnMonthNext">Next' +
            '<span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span></button>' +
            '</div>'+
            '<table class="calenderTable table">' +
            '<tr>';
        // To set the top day heading.
        for (s = 0; s < 7; s++)
            calenderHtml += '<th class="' + dayClass + '">' + daysWeek[s] + '</th>';
        calenderHtml += '</tr>' +
        '<tr>';
        // Get the start weekday of month.
        var startOfMonth= settings.calDays[0].fullDate.getDay();
        for(var k=0;k<startOfMonth;k++){
            calenderHtml += '<td class="'+dayClass+'"></td>';
        }
        for (var i = 0,j=startOfMonth+1,len=(settings.calDays.length+startOfMonth) - 1; i <= len,j<=len+1; i++,j++) {
            var today = new Date();
            var thisCalDay =settings.calDays[i].date;

            if (settings.calDays[i].fullDate.getFullYear() == today.getFullYear()
                && settings.calDays[i].fullDate.getMonth() == today.getMonth()
                && settings.calDays[i].fullDate.getDate() == today.getDate())
                thisCalDay = '<span id="today" class="dayDate">' + thisCalDay + '</span>';
            else{
                thisCalDay = '<span class="dayDate">' + thisCalDay + '</span>';
            }
            if (settings.calDays[i].events.length > 0) {
                calenderHtml += '<td class="' + dateClass + ' hasEvent">' + thisCalDay + '</td>';
            }
            else {
                calenderHtml += '<td class="' + dateClass + '">' + thisCalDay + '</td>';
            }
            if (((j) % 7 == 0) && (j < 36))
                calenderHtml += '</tr>' +
                '<tr>';
        }
        calenderHtml += '</tr></table></div>';
        return calenderHtml;
    };



    var monthClickFunction = function() {
        var addEventsToView = function (eventsToAdd) {
            var html = '<div class="wrap">';
            eventsToAdd.forEach(function (element) {
                var duration = element.startTime.substr(10,9)+ ' to ' + element.endTime.substr(11,9);
                html += '<div class="eventRow" title="'+element.name+'" data-description="'+element.description+
                '" data-heading="'+element.name+
                '" data-duration="'+duration+ '">'+
                (element.name.length < 19 ? element.name : element.name.substr(0,17) + '..') +
                '</div>';
            });
            html += '</div>';
            this.innerHTML += html;
        };

        // generate day objects for the month.
        generateCalDays(settings.selectedMonth, settings.selectedYear);

        // Generating calender.
        document.getElementById("calender").innerHTML = '';
        document.getElementById("calender").innerHTML += buildMonthCal("daysOfWeek", "days");

        var datesWithEvents = document.getElementsByClassName('hasEvent');

        for (var i = 0, len = settings.calEventDays.length; i < len; i++) {
            addEventsToView.call(datesWithEvents[i], settings.calEventDays[i].events);
        }
    };

    var dayClickFunction = function(){
        // generate day objects for the month.
        generateCalDays(settings.selectedMonth, settings.selectedYear);
        document.getElementById("calender").innerHTML = '';
        document.getElementById("calender").innerHTML += buildDayCal();
    };

    var showEventDetails = function (heading, description, duration) {
        var html = '<h4 class="eventHeading">' +
            heading +
            '</h4>' +
            '<p class="eventDescription">' +
            description +
            '</p>' +
            '<p class="eventDuration">' +
            '<span class="glyphicon glyphicon-time"></span>'+
            duration +
            '</p>';
        document.getElementById('eventDetailWrap').classList.remove('hide');
        document.getElementById('eventDetail').innerHTML = html;
    };

    // Add event to month button.
    document.getElementById('btnMonth').addEventListener("click", monthClickFunction);
    document.getElementById('btnDay').addEventListener("click", dayClickFunction);

    document.getElementById('closeEvent').addEventListener("click", function (event) {
        event.target.parentNode.parentNode.classList.add('hide');
    });

    document.getElementById('calender').addEventListener("click", function (event) {
        if(event.target.id === 'btnMonthPrev' || event.target.parentNode.id === 'btnMonthPrev' ) {
            if(settings.selectedMonth == 1) {
                settings.selectedMonth = 12;
                settings.selectedYear = settings.selectedYear - 1;
            }
            else
                settings.selectedMonth = settings.selectedMonth - 1;
            generateCalDays(settings.selectedMonth,settings.selectedYear);
            monthClickFunction();
        }
        else if(event.target.id === 'btnMonthNext' || event.target.parentNode.id === 'btnMonthNext'){
            if(settings.selectedMonth === 12) {
                settings.selectedMonth = 1;
                settings.selectedYear = settings.selectedYear + 1;
            }
            else
                settings.selectedMonth = settings.selectedMonth + 1;
            generateCalDays(settings.selectedMonth,settings.selectedYear);
            monthClickFunction();
        }
        else if(event.target.id === 'btnDayPrev' || event.target.parentNode.id === 'btnDayPrev'){
            var currentDay = new Date(settings.selectedYear,settings.selectedMonth,settings.selectedDateDay);
            // 24 hours is equal to 86400000 milliseconds.
            var prevDay = new Date(currentDay.getTime()-86400000);
            settings.selectedYear = prevDay.getFullYear();
            settings.selectedMonth = prevDay.getMonth();
            settings.selectedDateDay = prevDay.getDate();

            generateCalDays(settings.selectedMonth,settings.selectedYear);
            dayClickFunction();
        }
        else if(event.target.id === 'btnDayNext' || event.target.parentNode.id === 'btnDayNext'){
            var currentDay1 = new Date(settings.selectedYear,settings.selectedMonth,settings.selectedDateDay);

            // 24 hours is equal to 86400000 milliseconds.
            var nextDay = new Date(currentDay1.getTime()+86400000);
            settings.selectedYear = nextDay.getFullYear();
            settings.selectedMonth = nextDay.getMonth();
            settings.selectedDateDay = nextDay.getDate();

            generateCalDays(settings.selectedMonth,settings.selectedYear);
            dayClickFunction();
        }
        else if(event.target.classList.contains('eventRow') || event.target.classList.contains('eventDay')){
            var desp = (event.target.getAttribute('data-description'));
            var heading = (event.target.getAttribute('data-heading'));
            var duration = (event.target.getAttribute('data-duration'));
            showEventDetails(heading,desp,duration);
        }
    });
})();