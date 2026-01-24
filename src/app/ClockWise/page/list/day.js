import {widget, createWidget, align} from '@zos/ui'
import { push } from '@zos/router'
import { getText } from '@zos/i18n'
import { onGesture, GESTURE_RIGHT } from '@zos/interaction'
import { eventServise } from '../../utils/Globals'
import { styleColors } from '../../utils/Constants'
import { DeleteDialog } from '../../common/widgets/DeleteDialog'
import { Event } from '../../utils/models/Event'
import { PageIndicator } from '../../common/widgets/PageIndicator'
import { PageTitle } from '../../common/widgets/PageTitle'
import { MONTH_SHORT, WEEK_DAYS_SHORT } from '../../utils/Constants'
import { BackBtn } from '../../common/widgets/backBtn'


KEYS = { 
    period: 'period',
    description: 'description',
    status: 'status',
    check_repeat: 'check_repeat',
    del_img: 'del_img',
    edit_img: 'edit_img',
    previous: 'previous',
    next: 'next',
    create: 'create'
}
Page ({
    widgets: {
        list: null,
        pageIndicator: null,
        title: null,
        date: null,
        backBtn: null,
        createBtn: null,
    },
    data: {
        date: null,
        url: null,
        listOfEvents: [],
    },

    onInit(params) {
        this.registerGes()
        this.parseParams(params)
        this.data.listOfEvents = eventServise.getListOfEvents(this.data.date)
        this.initTitle()
        this.widgets.pageIndicator = new PageIndicator(this.data.listOfEvents.length + 3)
        this.initList()
        this.widgets.backBtn = BackBtn.renderBackBtn('Back', this.data.url)
    },

    registerGes(){
        onGesture({
            callback: (event) => {
            if (event === GESTURE_RIGHT) {
            }
            return true
            },
        })
    },

    getItemOfEventConfig(){
        return [
          { x: 0, y: 10, w: 380, h: 40, key: KEYS.period, color: styleColors.white_smoke, text_size: 30, align_h: align.CENTER_H},
          { x: 0, y: 50, w: 380, h: 80, key: KEYS.description, color: styleColors.white_smoke, text_size: 40, align_h: align.CENTER_H},
          { x: 0, y: 130, w: 380, h: 40, key: KEYS.status, color: styleColors.white_smoke, text_size: 30, align_h: align.CENTER_H},
          { x: 0, y: 190, w: 380, h: 40, key: KEYS.check_repeat, color: styleColors.white_smoke, text_size: 30, align_h: align.CENTER_H}
        ]
    },

    getActionsBtnsConfig(){
        return [
            { x:410, y: 20, w: 64, h: 64, key: KEYS.del_img, action: true },
            { x:410, y: 150, w: 64, h: 64, key: KEYS.edit_img, action: true }
        ]
    },

    initTitle(){
        this.widgets.title = PageTitle.renderTitle('List of events')
            const dateText = '🗓️ ' + 
                            this.data.date.getDate() + ' ' +
                            getText(MONTH_SHORT[this.data.date.getMonth()]) + ' ' +
                            getText(WEEK_DAYS_SHORT[this.data.date.getDay()])
            this.widgets.date = createWidget(widget.TEXT, {
            text: dateText,
            w: 480,
            x: 0,
            y: 20,
            text_size: 25,
            align_h: align.CENTER_H,
        })
    },

    parseParams(params){
        try {
            const initData = JSON.parse(params)
            this.data.date = new Date(initData.date)
            this.data.url = initData.url
        } catch {
            this.data.url ='page/index'
            this.data.date = new Date()
        }
    },

    initList(){
        const itemConfig = this.initItemConfig()
        const preparedList = this.prepareEventsFieldsAndAddKeys()
        const dataTypeConfig = this.initDataTypeConfig(preparedList.length)
        this.widgets.list = createWidget(widget.SCROLL_LIST, {
            x: (480-380)/2,
            y: 110,
            h: 270,
            w: 370,
            radius:10,
            item_space: 10,
            snap_to_center: true,
            item_enable_horizon_drag: true,
            item_drag_max_distance: -120,
            item_config: itemConfig,
            item_config_count: itemConfig.length,
            data_array: preparedList,
            data_count: preparedList.length,
            data_type_config: dataTypeConfig,
            data_type_config_count: dataTypeConfig.length,
            item_focus_change_func: (list, index, focus) => {
                this.widgets.pageIndicator.updatePageIndicator(index)
            },
            item_click_func: this.itemClick.bind(this)
        })
    },

    itemClick(item, index, data_key){
        console.log(JSON.stringify(data_key))
        if (data_key === KEYS.del_img)
            new DeleteDialog(this.data.listOfEvents[index-1], this.data.date, 'page/calendar')
        else if (data_key === KEYS.edit_img)
            push({
              url: 'page/event/edit/menu',
              params: JSON.stringify(this.data.listOfEvents[index-1])
            })
        else if (data_key === KEYS.create){
            const event = {start: this.data.date }
            push({
              url: 'page/event/create/description',
              params: JSON.stringify(event)
            })            
        }
        else if (data_key === KEYS.previous || data_key === KEYS.next){
            let newDate = null;
            if (data_key === KEYS.next){
                newDate = new Date(this.data.date);
                newDate.setDate(newDate.getDate() + 1)
            }
            else if (data_key === KEYS.previous){
                newDate = new Date(this.data.date);
                newDate.setDate(newDate.getDate() - 1)
            }
            push({
              url: 'page/list/day',
              params: {date: newDate, url: 'page/index'}
            })
        }
    },

    prepareEventsFieldsAndAddKeys(){
      let result = [];
      result.push({previous: 'previous.png'});
      for (const event of this.data.listOfEvents) {
          const eventCopy = { ...event };
          eventCopy.date_period = '🗓️ ' + eventCopy.date_period;
          eventCopy.period = '🕑 ' + eventCopy.period + ' ' + new Event(eventCopy).getDuration();
          eventCopy.weekDay = new Event(eventCopy).getWeekDay();
          eventCopy.del_img = 'delete.png';
          eventCopy.edit_img = 'edit.png';
          switch (eventCopy.check_repeat) {
              case 'never':
                  eventCopy.check_repeat = '🔄 ' + getText('Once');;
                  break;
              case 'day':
                  eventCopy.check_repeat = '🔄 ' + getText('Every day');
                  break;
              case 'week':
                  eventCopy.check_repeat = '🔄 ' + getText('Every week');
                  break;
              case 'month':
                  eventCopy.check_repeat = '🔄 ' + getText('Every month');
                  break;
          }
          result.push(eventCopy);
      }
      result.push({ create: '✏️ ' + getText('Create new event')});
      result.push({ next: 'next.png'});
      return result;
    },

    initDataTypeConfig(preparedArrayLength){
        const separatedByColorInd = eventServise.separateListToPastCurrentFutureEvents(this.data.listOfEvents)
        return [
          {
            start: 0,
            end:  0,
            type_id: 0,
            visible: true
          },
          {
            start: 1,
            end: separatedByColorInd.past,
            type_id: 1,
            visible: separatedByColorInd.past > 0
          },
          {
            start: separatedByColorInd.past == 0 ? 1 : separatedByColorInd.past+1,
            end: separatedByColorInd.current,
            type_id: 2,
            visible: separatedByColorInd.current > separatedByColorInd.past
          },
          {
            start: separatedByColorInd.current == 0 ? 1 : separatedByColorInd.current+1,
            end: preparedArrayLength - 3,
            type_id: 3,
            visible: separatedByColorInd.future > 0
          },
          {
            start: preparedArrayLength-2,
            end: preparedArrayLength-2,
            type_id: 4,
            visible: true
          },
          {
            start: preparedArrayLength - 1,
            end: preparedArrayLength - 1,
            type_id: 5,
            visible: true
          }
        ]
    },

    initEventItem(typeId, color){
        return  {
            type_id: typeId,
            item_bg_color: color,
            item_bg_radius: 10,
            text_view: this.getItemOfEventConfig(),
            text_view_count: 4,
            image_view: this.getActionsBtnsConfig(),
            image_view_count: 2,
            item_height: 270
        }
    },

    initCreateBtn(typeId, color){
        return  {
            type_id: typeId,
            item_bg_color: color,
            item_bg_radius: 10,
            text_view:  [{ x: 0, y: 0, w: 380, h: 100, key: KEYS.create, color: styleColors.white_smoke, action: true, text_size: 30, align_h: align.CENTER_H}],
            text_view_count: 1,
            image_view_count: 0,
            item_height: 100
        }
    },

    initNavigationBtn(typeId, key, yPos){
        return  {
            type_id: typeId,
            image_view: [{ x: (400-70)/2, y: yPos, w: 70, h: 70, key: key, action: true }],
            image_view_count: 1,
            item_height: 0
        }
    },

    initItemConfig(){
        return [
            this.initNavigationBtn(0, KEYS.previous, -65),
            this.initEventItem(1, styleColors.dark_gray),
            this.initEventItem(2, styleColors.dark_green),
            this.initEventItem(3, styleColors.dark_blue),
            this.initCreateBtn(4, styleColors.dodger_blue),
            this.initNavigationBtn(5, KEYS.next, 25),
        ]
    }
})