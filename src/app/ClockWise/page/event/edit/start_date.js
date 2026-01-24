import {createWidget, widget, prop} from '@zos/ui'
import { push } from '@zos/router'
import { getText } from '@zos/i18n'
import { eventServise } from '../../../utils/Globals'


Page ({
    widgets: {
        picker: null
    },
    data: {
        event: null,
        date: new Date(),
        dateConfig: []
    },

    onInit(params) {
        this.checkParams(params)
        this.widgets.picker = this.initPicker()
    },

    getDaysInMonth(year, month) {
        return new Date(year, month, 0).getDate();
    },

    attention(picker){
        let result = false
        if ((new Date(this.data.event.end).getTime() - new Date(this.data.date).getTime()) < 60000 ){
            picker.setProperty(prop.SUBTITLE, getText('Invalid date'))
            result = true
        } else picker.setProperty(prop.SUBTITLE, '')
        return result
    },

    initDataArrays() {
        const year = this.data.date.getFullYear();
        const month = this.data.date.getMonth() + 1;
        const daysInMonth = this.getDaysInMonth(year, month);
        
        const currentDay = this.data.date.getDate();
        if (currentDay > daysInMonth) {
            this.data.date.setDate(daysInMonth);
        }
        
        this.data.dateConfig = [
            new Array(daysInMonth).fill(0).map((d, index) => index + 1),
            new Array(12).fill(0).map((d, index) => index + 1),
            new Array(3).fill(0).map((d, index) => index + year),
            new Array(24).fill(0).map((d, index) => index),
            new Array(60).fill(0).map((d, index) => index)
        ]
    },

    initPickerConfig() {
        this.initDataArrays()
        const pickerFields = ['D', 'M', 'Y', 'h', 'm']
        const currentDate = [
            this.data.date.getDate() - 1,
            this.data.date.getMonth(),
            0,
            this.data.date.getHours(),
            this.data.date.getMinutes()
        ]
        
        const currentYear = this.data.date.getFullYear();
        const yearArray = this.data.dateConfig[2];
        const yearIndex = yearArray.indexOf(currentYear);
        currentDate[2] = yearIndex !== -1 ? yearIndex : 0;
        
        const result = []
        for (let i = 0; i < this.data.dateConfig.length; i++) {
            const field = {
                data_array: this.data.dateConfig[i],
                init_val_index: currentDate[i],
                unit: getText(pickerFields[i]),
                support_loop: true,
                font_size: 30,
                select_font_size: 35,
                connector_font_size: 1,
                unit_font_size: 5,
                col_width: 45
            }
            result.push(field)
        }
        return result
    },

    checkParams(params){
        this.data.event = JSON.parse(params)
        try {
            this.data.date = new Date(this.data.event.start)
            if (isNaN(this.data.date.getTime())) throw new Error
        } catch {
            this.data.date = new Date()
        }
    },

    confirmDate(){
        this.data.event.start = this.data.date 
        console.log(JSON.stringify(this.data.event))
        eventServise.editEvent(this.data.event)
        push({
            url: 'page/index',
        })
    },

    getPickerFunc() {
        const updateDayColumn = (picker, year, month) => {
            const daysInMonth = this.getDaysInMonth(year, month);
            const newDaysArray = new Array(daysInMonth).fill(0).map((d, index) => index + 1);
            this.data.dateConfig[0] = newDaysArray;
            const currentDay = this.data.date.getDate();
            if (currentDay > daysInMonth) {
                this.data.date.setDate(daysInMonth);
            }
            picker.setProperty(prop.UPDATE_DATA, {
                col_index: 0,
                val_index: Math.min(this.data.date.getDate() - 1, daysInMonth - 1),
                data_array: newDaysArray
            });
        }
        
        const pickerFunc = (picker, event_type, column_index, select_index) => {
            if (event_type === 1) {
                switch(column_index) {
                    case 0:
                        this.data.date.setDate(this.data.dateConfig[0][select_index])
                        break
                    case 1:
                        const newMonth = this.data.dateConfig[1][select_index];
                        this.data.date.setMonth(newMonth - 1);
                        updateDayColumn(picker, this.data.date.getFullYear(), newMonth);
                        break
                    case 2:
                        const newYear = this.data.dateConfig[2][select_index];
                        this.data.date.setFullYear(newYear);
                        updateDayColumn(picker, newYear, this.data.date.getMonth() + 1);
                        break
                    case 3:
                        this.data.date.setHours(this.data.dateConfig[3][select_index])
                        break
                    case 4:
                        this.data.date.setMinutes(this.data.dateConfig[4][select_index])
                        break                       
                }
                this.attention(picker)
            }
            else if (event_type === 2) {
                if (!this.attention(picker)) this.confirmDate()
            }
        }
        return pickerFunc
    },

    initPicker() {
        const pickerFunc = this.getPickerFunc()
        const config = this.initPickerConfig()
        this.widgets.picker = createWidget(widget.WIDGET_PICKER, {
            title: '✏️ ' + getText('Start date'),
            subtitle: '',
            nb_of_columns: config.length,
            single_wide: true,
            init_col_index: 1,
            data_config: config,
            picker_cb: pickerFunc
        })
    },
})