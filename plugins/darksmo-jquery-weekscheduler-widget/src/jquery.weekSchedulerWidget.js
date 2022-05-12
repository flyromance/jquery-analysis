/**
 * @fileOverview Contains the code for jQuery.weekSchedulerWidget
 * 
 * @author Savio Dimatteo <darksmo@gmail.com>
 */

(function($) {
    var __name__ = 'weekSchedulerWidget';

    var __dayMapping = []; // to be populated during init

    var eventsThrown = {
        EVT_CONFIRM_CLICKED: 'onConfirm.' + __name__,
        EVT_CANCEL_CLICKED: 'onCancel.' + __name__,
        EVT_WEEK_CHANGED: 'onWeekSelected.' + __name__
    };

    var methods = {
        /**
         * Allows the user to select just one day instead of multiple days.
         * Option boxes will be used instead of checkboxes (i.e, the current
         * markup is actually changed).
         *
         * Before calling this method, you must make sure that exactly one
         * checkbox is selected.
         *
         * An error is thrown if multiple options or no options are selected.
         * @name setSingleDaySelect
         * @function
         * @access public
         * @param {boolean} isSingleDaySelect - whether to use options insead of checkboxes
         * @returns {jQueryObject} $this - for chainability
         */
        'setSingleDaySelect': function (isSingleDaySelect) {
            var $this = this,
                settings = $this.data('settings');
            //
            // First we make sure that only one option is selected and we throw
            // error in case is not.
            //
            var currentSelection = methods.getSelection.call($this);
            var currentSelectionDays = currentSelection.days;
            if (currentSelectionDays.length > 1 && isSingleDaySelect) {
                $.error('One or zero days must be selected when setSingleDaySelect is called. Found ' + currentSelectionDays.length + ' days selected instead.');
            }

            // Save the settings
            settings.singleDaySelect = isSingleDaySelect;
            $this.data('settings', settings);

            //
            // Now re-render the html with the option buttons instead of the
            // checkboxes.
            // 
            methods._refreshHtml.call($this);

            // 
            // Now select the days according to the current selection
            //
            methods.setDaysWithState.call($this, currentSelectionDays);

            return $this;
        },
        /**
         * Selects the specified minutes. Throws an error if the minute doesn't
         * respect the user selected precision.
         *
         * @name setMinutes
         * @function
         * @access public 
         * @param {number} minutes - the minutes to set
         * @returns {jQueryObject} $(this) - for chainability
         **/
        'setMinutes' : function (minute) {
            var $this = this,
                settings = $this.data('settings');

            var minutes = methods._enumerateMinutes.call($this, settings.minutesPrecision);
            var minutesNumeric = $(minutes).map(function (i, e) { return e.number; });
            
            // 
            // Check that the minute is a valid minute
            //
            if (minutesNumeric.toArray().indexOf(minute) === -1) {
                $.error('the minute ' + minute + ' is not valid and should be one of ' + minutesNumeric.toArray().join(","));
            }

            $this.find('.weekSchedulerMinuteOption[name!=minute' + minute + ']').prop('selected', '');
            $this.find('.weekSchedulerMinuteOption[name=minute' + minute + ']').prop('selected', 'selected');
            
            return $this;
        },
        /**
         * Selects the specified hour
         *
         * @name setHour
         * @function
         * @access public 
         * @param {number} hour - the hour * @returns {jQueryObject} $(this) - for chainability
         **/
        'setHour' : function (hour) {
            var $this = this;

            $this.find('.weekSchedulerHourOption[name!=hour' + hour + ']').prop('selected', '');
            $this.find('.weekSchedulerHourOption[name=hour' + hour + ']').prop('selected', 'selected');
            
            return $this;
        },
        /**
         * Selects the date range falling in the specified day of the week.
         *
         * @name setWeek
         * @function
         * @access public
         * @param {Date} dayOfWeek - a date object indicating the day of the week
         * @returns {jQueryObject} ${this} - for chainability
         */
        'setWeek' : function (dayOfWeek) {
            var $this = this;
            
            var week = methods._getWeekOfDay.call($this, dayOfWeek);
            var weekValue = week[0].getTime() + '-' + week[1].getTime();

            $this.find('option[value!=' + weekValue + ']').prop('selected', '');
            $this.find('option[value=' + weekValue + ']').prop('selected', 'selected');
            
            return $this;
        },
        /**
         * Ticks or selects the specified dates of the week and unticks the
         * other days of the week. An exception is thrown if you try to set
         * multiple days on a singleDaySelect widget.
         *
         * @name setDays
         * @function
         * @access public
         * @param {array} days - the selection to be set
         * @returns {jQueryObject} ${this} - for chainability
         *
         */
        'setDays' : function (daysArray) {
            var $this = this,
                settings = $this.data('settings');

            if (settings.singleDaySelect === true && daysArray.length > 1) {
                $.error("Only one day can be selected if the singleDaySelect option is set to true");
            }

            var daysWithState = [];
            var i;
            for (i=0; i<daysArray.length; i++) {
                daysWithState.push({
                    day: daysArray[i],
                    state: 'checked'
                });
            }

            methods.setDaysWithState.call($this, daysWithState);

            return $this;
        },
        /**
         * Selects the specified dates of the week and unticks the other days
         * of the week. Each element in the array of state/days is an object
         * like:
         * {
         *   state: "indeterminate", # or "checked"
         *   day: 3
         * }
         *
         * Duplicates are ignored, and if a day is appearing twice, the one
         * with the "checked" state will be preferred over the one with
         * "indeterminate" state. Throws an error if the state is not a valid
         * value.
         * 
         * @name setDaysWithState
         * @function
         * @access public
         * @param {array} dayStates - the days to be set and corresponding states
         * @returns {jQueryObject} ${this} - for chainability
         *
         */
        'setDaysWithState' : function (dayStateArray) {
            var $this = this;

            var willDayBeChecked = {
                0: false,
                1: false,
                2: false,
                3: false,
                4: false,
                5: false,
                6: false
            };

            var daysToSelect = {
                0: false,
                1: false,
                2: false,
                3: false,
                4: false,
                5: false,
                6: false
            };


            var i, day, state, dayState;
            for (i=0; i<dayStateArray.length; i++) {
                dayState = dayStateArray[i];
                day = dayState.day;
                state = dayState.state;
                if (state !== "indeterminate" && state !== "checked") {
                    $.error('"' + state + '" is an invalid state. Use "checked" or "indeterminate" instead.');
                }

                daysToSelect[day] = true;
                if (!willDayBeChecked[day] && state === 'checked') {
                    willDayBeChecked[day] = true;
                }

            }

            var k;
            for (k in daysToSelect) {
                if (daysToSelect.hasOwnProperty(k)) {
                    var $element = $this.find('input[value=' + k + ']');

                    if (daysToSelect[k]) {
                        if (willDayBeChecked[k]) {
                            $element.prop('checked', true);
                            $element.prop('indeterminate', false);
                        }
                        else {
                            $element.prop('indeterminate', true);
                            $element.prop('checked', false);
                        }
                    }
                    else {
                        $element.prop('checked', false);
                        $element.prop('indeterminate', false);
                    }
                }
            }

            return $this;
        },
        /**
         * Selects various controls in the UI according to the given selection.
         * For the days object in the selection accepts an array of { day:
         * Date object, state: "indeterminate" or "checked" }.
         *
         * @name setSelectionWithState
         * @function
         * @access private
         * @param {object} selection - the desired selection
         * @returns {jQueryObject} $(this) - for chainability
         **/
        'setSelectionWithState': function (selection) {
            var $this = this;

            methods.setWeek.call($this, selection.week[0]);
            methods.setDaysWithState.call($this, selection.days);
            methods.setHour.call($this, selection.hour);
            methods.setMinutes.call($this, selection.minutes);
            
            return $this;
        },
        /**
         * Selects various controls in the UI according to the given selection.
         *
         * @name setSelection
         * @function
         * @access private
         * @param {object} selection - the desired selection
         * @returns {jQueryObject} $(this) - for chainability
         **/
        'setSelection': function (selection) {
            var $this = this;
            

            var days = selection.days;
            var daysWithState = [];
            var i;
            for (i=0; i<days.length; i++) {
                daysWithState.push({
                    day: days[i],
                    state: 'checked'
                });
            }

            selection.days = daysWithState;

            methods.setSelectionWithState.call($this, selection);
            
            return $this;
        },
        /**
         * Returns the selection made by the user
         *
         * @name getSelection
         * @function
         * @access public 
         * @returns {object} selection - the selection of the user, like { week: [Date, Date], days: [{ day: 0, state: "checked"}, { day: 3, state: "indeterminate" }], hour: 21, minutes: 59 }
         **/
        'getSelection': function () {
            var $this = this;
            //
            // Find out what was selected in the form, and the state
            //
            var selectedDays = [];
            $('input[name=days]').each(function() {
                var $that = $(this);
                if ($that.prop('checked') === true || $that.prop('indeterminate') === true) {
                    selectedDays.push({
                        day: parseInt($that.val(), 10),
                        state: $that.prop('checked') ? "checked" : "indeterminate"
                    });
                }
            });

            return {
                week: $this.find('.weekSchedulerWidgetWeeksSelect').val().split("-").map(function (x) { return new Date(parseInt(x, 10)); }),
                days: selectedDays,
                hour: $this.find('.weekSchedulerWidgetHourSelect').val(),
                minutes: $this.find('.weekSchedulerWidgetMinutesSelect').val()
            };
        },
        /**
         * Returns an array of Dates and States, given the selection object from
         * _getSelectedDates.
         *
         * @name _getSelectedDates
         * @function
         * @access private
         * @returns {array} selection - an array of dates, and corresponding states
         **/
        '_getSelectedDates' : function (selection) {
            var selectedDates = [];

            // create a date object for each selected day
            var i, 
                len = selection.days.length,
                selectedDayState,
                selectedDayNum;

            for (i=0; i<len; i++) {
                selectedDayNum = selection.days[i].day;
                selectedDayState = selection.days[i].state;

                // start from a day representing the beginning of the week
                var dayDate = new Date(selection.week[0]);

                // set the day
                dayDate.setDate(dayDate.getDate() + __dayMapping.indexOf(selectedDayNum));

                // set the hour
                dayDate.setHours(selection.hour);

                // set the minute
                dayDate.setMinutes(selection.minutes);

                selectedDates.push({
                    date: dayDate,
                    state: selectedDayState
                });
            }

            return selectedDates;
        },
        /**
         * Returns an array of Dates, each representing a day of the week
         * selected by the user.
         *
         * @name getSelectedDates
         * @function
         * @access public
         * @returns {array} selection - an array of dates representing the selection of the user
         **/
        'getSelectedDates' : function () {
            var $this = this;

            var selection = methods.getSelection.call($this);

            return methods._getSelectedDates.call($this, selection);
        },
        /**
         * Sets the current selection based on a given set of Date objects. The
         * dates specified must all fall within the same week, and have the
         * same hour and minute set. An error is thrown if this is not
         * respected.
         *
         * @name setDates
         * @function
         * @access public 
         * @param {array} datesArray - the array of Date objects
         * @returns {jqueryObject} $(this) - for chainability
         **/
        'setDates' : function (datesArray) {
            var $this = this;

            var datesWithState = [];
            var i;
            for (i=0; i<datesArray.length; i++) {
                datesWithState.push({
                    date: datesArray[i],
                    state: 'checked'
                });
            }

            methods.setDatesWithState.call($this, datesWithState);
        },
        /**
         * Same as setDates, but the array passed in input also contains the
         * state of the checkbox.
         *
         * @name setDatesWithState
         * @function
         * @access public 
         * @param {array} datesStateArray - the array of Date objects and their state (i.e., { date: new Date(), state: "indeterminate" } }. The state can be "checked" or "indeterminate".
         * @returns {jqueryObject} $(this) - for chainability
         **/
        'setDatesWithState' : function (datesStateArray) {
            var $this = this;

            //
            // We need to make sure we are all good to set the selected dates...
            //
            var hours, minute, week;

            var h, m, w;

            var dateState, date, state, lastDate, i;

            // given that we are there, also exctract the various day numbers
            var daysAndState = [];

            for (i=0; dateState = datesStateArray[i++];) {
                date = dateState.date;
                state = dateState.state;
                h = date.getHours();
                m = date.getMinutes();
                w = methods._getWeekOfDay.call($this, date);

                daysAndState.push({
                    day: date.getDay(),
                    state: state
                });

                if (typeof week === 'undefined') {
                    week = w;
                    minute = m;
                    hours = h;
                }
                else {
                    if (week[0].getTime() !== w[0].getTime() ||
                        week[1].getTime() !== w[1].getTime()) {

                        $.error("cannot use this dateset because not all the dates fall in the same week range");
                    }
                    if (minute !== m) {
                        $.error("cannot use this dateset because not all the dates are set to the same minute");
                    }
                    if (hours !== h) {
                        $.error("cannot use this dateset because not all the dates are set to the same hour");
                    }
                }

                lastDate = date;
            }

            // now h m w contain valid stuff, and we can set.
            methods.setSelectionWithState.call($this, {
                week: [lastDate, lastDate],
                days: daysAndState,
                hour: h,
                minutes: m
            });

            return $this;
        },
        /**
         * Shows the widget to the user
         *
         * @name show 
         * @function
         * @access public 
         * @returns {jqueryObject} $this - for chainability
         **/
        'show' : function () {
            var $this = this,
                settings = $this.data('settings');

            if ($this.css('display') === 'block' ||
                $this.css('display') === 'inline') {
                return;
            }

            if (settings.onBeforeShow.call($this)) {

                $this.show();
            }

            settings.onAfterShow.call($this);

            return $this;
        },
        /**
         * Hides the widget to the user
         *
         * @name hide 
         * @function
         * @access public 
         * @returns {jqueryObject} $this - for chainability
         **/
        'hide' : function (triggerEvents) {
            var $this = this,
                settings = $this.data('settings');

            if ($this.css('display') === 'none') {
                return;
            }

            triggerEvents = (typeof triggerEvents === 'undefined') ? true : triggerEvents;

            var canHide = true;
            if (triggerEvents && !settings.onBeforeHide.call($this)) {
                canHide = false;
            }

            if (canHide) {
                $this.hide();
            }

            if (triggerEvents) {
                settings.onAfterHide.call($this);
            }

            return $this;
        },
        /**
         * Populates the day mapping, an array that maps [ userDay (index) ] ->
         * dateDay (value). For example, [3, 4, 5, 6, 0, 1, 2] means that day 0
         * for the user is day 3 for the Date object. This still follows the
         * convention 0 = sunday 6 = saturday.
         * Throws an error in case of problems.
         *
         * @name _populateDayMapping
         * @function
         * @access private
         * @param {number} startDay - the first day for the user
         * @param {number} endDay - the last day for the user
         * @returns {array} mapping - the user -> date days mapping
         **/
        '_buildDayMapping' : function (startDay, endDay) {
            var mapping = [];

            if (endDay !== startDay - 1) {
                $.error('Invalid indices, must be end = start - 1');
            }
            if (endDay >= 7 || endDay < 0) {
                $.error('Invalid endDay index, must be between 0 and 6');
            }
            if (startDay >= 7 || startDay < 0) {
                $.error('Invalid startDay index, must be between 0 and 6');
            }

            var start = startDay;
            while (start !== endDay) {
                mapping.push(start++);
                if (start === 7) {
                    start = 0;
                }
            }
            mapping.push(start++);

            return mapping;
        },
        '_bindEvents': function () {
            var $this = this;

            $this.find(".weekSchedulerWidgetWeeksSelect").bind('change', function () {
                $this.trigger($.Event(eventsThrown.EVT_WEEK_CHANGED));
            });

            $this.bind('click', function (e) {

                if (typeof e.target !== 'undefined') {
                    var $target = $(e.target);
                    if ($target.hasClass('weekSchedulerWidgetButtonCancel')) {
                        $this.trigger($.Event(eventsThrown.EVT_CANCEL_CLICKED));
                    }
                    else if ($target.hasClass('weekSchedulerWidgetButtonConfirm')) {
                        $this.trigger($.Event(eventsThrown.EVT_CONFIRM_CLICKED));
                    }
                }
            });
        },
        /**
         * Returns an array containing an enumeration of all the minutes given
         * the current precision.
         *
         * @name _enumerateMinutes
         * @function
         * @access private
         * @returns {array} numbers - an array containing all the valid minutes for the given precision
         */
        '_enumerateMinutes' : function (precision) {
            var result = [];

            var i;
            for (i=0; i < 60; i+=precision) {
                result.push({
                    number: (i === 60 ? 0 : i),
                    string: ('00' +  i).slice(-2)
                });
            }
            return result;
        },
        /**
         * Returns the markup for the minutes dropdown.
         *
         * @name _getMinutesMarkup
         * @function
         * @access private
         * @returns {string} markup - the markup of the minutes select widget
         */
        '_getMinutesMarkup' : function (precision) {
            var $this = this;
            var markup = [];

            // we are going to use a dropdown as there are too many numbers
            // to show in clickable buttons...
            //
            markup.push('<select class="weekSchedulerWidgetMinutesSelect">');

            var minutesArray = methods._enumerateMinutes.call($this, precision);

            var i, minute;
            for (i=0; minute = minutesArray[i++];) {

                markup.push(
                    [
                        '<option class="weekSchedulerMinuteOption" name="minute', minute.number, '" value="', minute.number ,'">', 
                        minute.string,
                        '</option>'
                    ].join('')
                );
            }

            markup.push('</select>');

            return markup.join('');
        },
        /**
         * Returns the markup for the hours dropdown.
         *
         * @name _getHoursMarkup
         * @function
         * @access private
         * @returns {string} dropdownMarkup - the markup of the dropdown box
         */
        '_getHoursMarkup' : function () {
            var dropDownMarkup = ['<select class="weekSchedulerWidgetHourSelect">'];
            var i;
            for (i=1; i<24; i++) {
                dropDownMarkup.push(
                    [
                        '<option class="weekSchedulerHourOption" name="hour', i,'" value="', i ,'">', 
                        ("00" + i).slice(-2),
                        '</option>'
                    ].join('')
                );
            }

            // add midnight at the end
            dropDownMarkup.push('<option name="hour0" value="0">00</option>');
            dropDownMarkup.push('</select>');

            return dropDownMarkup.join('');
        },
        /**
         * Returns the markup for the days checkboxes.
         *
         * @name _getDaysMarkup
         * @function
         * @access private
         * @returns {string} checkboxes - the checkboxes markup for the widget
         */
        '_getDaysMarkup' : function () {
            var $this = this,
                settings = $this.data('settings');

            var inputType = settings.singleDaySelect ? 'radio' : 'checkbox';

            var checkboxes = [];
            var i, day;
            for (i = 0; day = settings.localization.dayNames[i]; i++) {
                checkboxes.push([
                '<div class="weekSchedulerWidgetDay">',
                '<input id="weekSchedulerWidgetDay' + settings.localization.dayNames[i] + '" type="' + inputType + '" name="days" value="', __dayMapping[i], '" />',
                '<label for="weekSchedulerWidgetDay' + day + '" class="weekSchedulerWidgetDayName">', day, '</label>',
                '</div>'
                ].join(''));
            }

            return checkboxes.join('');
        },
        /**
         * Given a date, returns an array of two elements containing two Date
         * objects. The first one represents the first day of the week, the
         * second one represents the last day of the week.
         *
         * @name _getWeekOfDay
         * @param {Date} dayDate - the date of a day in the week to identify
         * @function
         * @access private
         * @returns {array} weekLimits an array containing the first and the last day of the week
         */
        '_getWeekOfDay' : function (dayDate) {
            var $this = this,
                settings = $this.data('settings');

            if (typeof dayDate === 'undefined') {
                $.error('_getWeekOfDay: dayDate parameter must be not null');
            }
            

            var moveUntilDayOfWeek = function (startDate, incrementDay, targetDayOfWeek) {
                var d = new Date(startDate);
                while (d.getDay() !== targetDayOfWeek) {
                    d.setDate(d.getDate() + incrementDay);
                }
                return d;
            };

            var dayDateWithoutTime = new Date(dayDate.getFullYear(), dayDate.getMonth(), dayDate.getDate());

            // move backwards/forwards until it's the first day of the week
            var firstDayOfWeek = moveUntilDayOfWeek(dayDateWithoutTime, -1, settings.firstDayOfWeek);
            var lastDayOfWeek = moveUntilDayOfWeek(dayDateWithoutTime, +1, settings.lastDayOfWeek);

            // reset hours, minutes, and seconds as needed
            firstDayOfWeek.setHours(0);
            firstDayOfWeek.setMinutes(0);
            firstDayOfWeek.setSeconds(0);

            lastDayOfWeek.setHours(23);
            lastDayOfWeek.setMinutes(59);
            lastDayOfWeek.setSeconds(59);


            return [firstDayOfWeek, lastDayOfWeek];
        },
        /**
         * Returns the markup of the select control for the week chooser
         *
         * @name _getWeeksMarkup
         * @function
         * @param {Date} startDate - a day in the middle of the starting week
         * @param {Date} endDate - a day in the middle of the ending week
         * @access private
         * @returns {string} weeksMarkup the select markup
         */
        '_getWeeksMarkup' : function (startDate, endDate) {
            var $this = this,
                settings = $this.data('settings');

            var selectMarkup = ['<select class="weekSchedulerWidgetWeeksSelect">'];

            var ourStartDate = new Date(startDate);
            var endWeek = methods._getWeekOfDay.call($this, endDate);

            var currentWeek;

            do {

                currentWeek = methods._getWeekOfDay.call($this, ourStartDate);

                selectMarkup.push([
                    '<option value="',
                    currentWeek[0].getTime() + '-' + currentWeek[1].getTime(),
                    '">',
                    currentWeek[0].getDate(), ' ',
                    settings.localization.monthNames[currentWeek[0].getMonth()], ' ',
                    currentWeek[0].getFullYear(), ' ',
                    settings.localization.to, ' ',
                    currentWeek[1].getDate(), ' ',
                    settings.localization.monthNames[currentWeek[1].getMonth()], ' ',
                    currentWeek[1].getFullYear(),
                    '</option>'
                ].join(''));

                // next week, in case we need to go there...
                ourStartDate.setDate( ourStartDate.getDate() + 7 );

            } while (currentWeek[0].getTime() !== endWeek[0].getTime() &&
                currentWeek[1].getTime() !== endWeek[1].getTime() );

            selectMarkup.push('</select>');

            return selectMarkup.join('');
        },
        /**
         * Returns the widget HTML markup
         *
         * @name _getWidgetHtml
         * @function
         * @access private
         * @returns {string} html the markup of the widget
         */
        '_getWidgetHtml' : function () {
            var $this = this,
                settings = $this.data('settings');

            var html = [
                '<div class="weekSchedulerWidgetContainer">',
                    '<span class="weekSchedulerWidgetTitle">',
                        settings.localization.title,
                    '</span>',
                    '<div class="weekSchedulerWidgetLabel">',
                        settings.localization.week,
                    '</div>',
                    methods._getWeeksMarkup.call($this, settings.startDate, settings.endDate),
                    '<div class="weekSchedulerWidgetLabel">',
                        settings.localization.days,
                    '</div>',
                    methods._getDaysMarkup.call($this),
                    '<div class="weekSchedulerWidgetClearfix"></div>',
                    '<div class="weekSchedulerWidgetLabel">',
                        settings.localization.time,
                    '</div>',
                    '<div class="weekSchedulerWidgetLayoutHorizontal">',
                        '<div class="weekSchedulerWidgetHour">',
                            '<div class="weekSchedulerWidgetSubLabel">',
                                settings.localization.hour,
                            '</div>',
                            methods._getHoursMarkup.call($this),
                        '</div>',
                        '<div class="weekSchedulerWidgetMinute">',
                            '<div class="weekSchedulerWidgetSubLabel">',
                                settings.localization.minute,
                            '</div>',
                            methods._getMinutesMarkup.call($this, settings.minutesPrecision),
                        '</div>',
                    '</div>',
                    '<div class="weekSchedulerWidgetClearfix"></div>',
                    '<div class="weekSchedulerWidgetLayoutHorizontalRight">',
                    '<div class="weekSchedulerWidgetButton weekSchedulerWidgetButtonConfirm">', settings.localization.confirm, '</div>',
                    '<div class="weekSchedulerWidgetButton weekSchedulerWidgetButtonCancel">', settings.localization.cancel, '</div>',
                    '</div>',
                    '<div class="weekSchedulerWidgetClearfix"></div>',
                '</div>'
            ].join('');

            return html;
        },
        /**
         * Validates the month names provided in localization.monthNames.
         * Throws error in case of mistakes.
         *
         * @name _validateMonthNames
         * @access private
         * @function
         * @param {array} monthArray - the array of localized month names
         * @returns {boolean} result - always true
         **/
        '_validateMonthNames': function (monthArray) {
            if (monthArray.length !== 12) {
                $.error('You need to provide exactly 12 months in localization.monthNames. Got ' +
                    monthArray.length + ' months instead');
            }
            return true;
        },
        /**
         * Validates the minutes precision parameter
         *
         * Throws error in case of mistakes.
         * @name _validateMinutesPrecision
         * @function
         * @access private
         * @param {number} minutesPrecision - the minutes precision specified by the user
         * @returns {boolean} result - always true
         **/
        '_validateMinutesPrecision' : function (minutesPrecision) {
            if (typeof minutesPrecision !== 'number') {
                $.error('please provide a number for the minutesPrecision option');
            }

            if (minutesPrecision <= 0) {
                $.error('the minutesPrecision parameter must be >= 1 and <= 30');
            }

            return true;
        },
        /**
         * Updates the markup of the widget based on the settings
         *
         * @name _refreshHtml
         * @function
         * @access private
         * @returns {jQueryObject} $(this) - for chainability
         **/
        '_refreshHtml' : function () {
            var $this = this;
            var html = methods._getWidgetHtml.call($this);

            $this.html(html);

            return $this;
        },
        /**
         * Destroys the week scheduler widget.
         *
         * @name destroy 
         * @function
         * @access public
         * @returns {jQueryObject} $(this) - for chainability
         */
        'destroy' : function() {
            var $this = this;

            $this.unbind('click');
            $this.find(".weekSchedulerWidgetWeeksSelect").unbind('change');
            $this.html('');
            __dayMapping = [];

            return $this;
        },
        /**
         * Initialises the week scheduler widget.
         *
         * @name init
         * @function
         * @param {object} [options] - the user options
         * @access public
         * @returns jqueryObject
         */
        'init' : function(options) {

            var settings = $.extend({
                localization: {
                    title: 'Schedule item',
                    week: 'Week',
                    days: 'Days',
                    time: 'Time',
                    hour: 'Hour',
                    minute: 'Minute',
                    confirm: 'Add',
                    cancel: 'Cancel',
                    to: 'to',
                    /* 
                     * Must start with the first day specified in
                     * firstDayOfWeek and end with the one corresponding to
                     * lastDayOfWeek 
                     * */
                    dayNames: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    monthNames: ['January', 'February', 'March', 'April',
                        'May', 'June', 'July', 'August', 'September', 'October',
                        'November', 'December'
                    ]
                },
                /*
                 * Whether to allow only one day to be selected instead of
                 * multiple days.
                 */
                singleDaySelect: false,
                /* 
                 * The granularity of the minutes picker (i.e., schedule at the
                 * 15th minute of the hour) 
                 * */
                minutesPrecision: 15,
                /*
                 * The day of the week we want to start from
                 */
                startDate: new Date(),
                /*
                 * The day of the week we want to end to
                 */
                endDate: (function () { var d = new Date(); d.setMonth(d.getMonth() + 1); return d; })(),
                /*
                 * 0 = sunday  6 = Saturday
                 */
                firstDayOfWeek: 1,
                lastDayOfWeek: 0,
                /*
                 * Whether to hide the widget at start time
                 */
                hideOnStart: false,
                onBeforeShow: function () { return true; }, // true: can show
                onAfterShow: function () {  },
                onBeforeHide: function () { return true; }, // true: can hide 
                onAfterHide: function () {  },
            }, options);

            methods._validateMonthNames(settings.localization.monthNames);
            methods._validateMinutesPrecision(settings.minutesPrecision);

            __dayMapping = methods._buildDayMapping(settings.firstDayOfWeek, settings.lastDayOfWeek);

            return this.each(function() {
                // save settings
                var $this = $(this);

                $this.data('settings', settings); // important: do this first

                if (settings.hideOnStart) {
                    var triggerEvents = false;
                    methods.hide.call($this, triggerEvents);
                }

                // save instance specific data...
                methods._refreshHtml.call($this);

                methods._bindEvents.call($this);
            });
        }
    };


    /**
     * jQuery Week Scheduler Widget - a jQuery widget to schedule an item on a chosen week
     *
     * @memberOf jQuery.fn
     */
    $.fn[__name__] = function(method) {
        /*
         * Just a router for method calls
         */
        if (methods[method]) {
            if (this.data('initialized') === true) {
                // call a method
                return methods[method].apply(this,
                    Array.prototype.slice.call(arguments, 1)
                );
            }
            else {
                throw new Error('method ' + method + ' called on an uninitialized instance of ' + __name__);
            }
        }
        else if (typeof method === 'object' || !method) {
            // call init, user passed the settings as parameters
            this.data('initialized', true);
            return methods.init.apply(this, arguments);
        }
        else {
            $.error('Cannot call method ' + method);
        }
    };
})(jQuery);
