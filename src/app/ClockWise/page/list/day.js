import { onGesture, GESTURE_RIGHT } from '@zos/interaction'
import {widget, createWidget, align} from '@zos/ui'
import { getText } from '@zos/i18n'
import { push } from '@zos/router'
import { px } from '@zos/utils'
import { MONTH_SHORT, SCREEN_SIZE, WEEK_DAYS_SHORT } from '../../utils/Constants'
import { PageIndicator } from '../../common/widgets/PageIndicator'
import { DeleteDialog } from '../../common/widgets/DeleteDialog'
import { PageTitle } from '../../common/widgets/PageTitle'
import { BackBtn } from '../../common/widgets/backBtn'
import { styleColors } from '../../utils/Constants'
import { eventServise } from '../../utils/Globals'
import { Event } from '../../utils/models/Event'


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
          { x: px(0), y: px(10), w: px(380), h: px(40), key: KEYS.period, color: styleColors.white_smoke, text_size: px(30), align_h: align.CENTER_H},
          { x: px(0), y: px(50), w: px(380), h: px(80), key: KEYS.description, color: styleColors.white_smoke, text_size: px(40), align_h: align.CENTER_H},
          { x: px(0), y: px(130), w: px(380), h: px(40), key: KEYS.status, color: styleColors.white_smoke, text_size: px(30), align_h: align.CENTER_H},
          { x: px(0), y: px(190), w: px(380), h: px(40), key: KEYS.check_repeat, color: styleColors.white_smoke, text_size: px(30), align_h: align.CENTER_H}
        ]
    },

    getActionsBtnsConfig(){
        return [
            { x: px(410), y: px(20), w: px(64), h: px(64), key: KEYS.del_img, action: true },
            { x: px(410), y: px(150), w: px(64), h: px(64), key: KEYS.edit_img, action: true }
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
            w: px(SCREEN_SIZE),
            x: px(0),
            y: px(20),
            text_size: px(25),
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
        const dataTypeConfig = this.initDataTypeConfig()
        this.widgets.list = createWidget(widget.SCROLL_LIST, {
            x: px((SCREEN_SIZE-380)/2),
            y: px(110),
            h: px(270),
            w: px(370),
            radius: px(10),
            item_space: px(10),
            snap_to_center: true,
            item_enable_horizon_drag: true,
            item_drag_max_distance: px(-120),
            item_config: itemConfig,
            item_config_count: itemConfig.length,
            data_array: preparedList,
            data_count: preparedList.length,
            data_type_config: dataTypeConfig,
            data_type_config_count: dataTypeConfig.length,
            item_focus_change_func: (list, index, focus) => {
                console.log('List index is: ' + index)
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

    initDataTypeConfig(){
        const conf = []
        let start = 0
        let end = 0
        let id = 0
        conf.push({ start: start, end:  end, type_id: id, visible: true })
        for (const i of this.data.listOfEvents){
            conf.push({ start: ++start, end: ++end, type_id: ++id, visible: true })
        }
        conf.push({ start: ++start, end:  ++end, type_id: ++id, visible: true })
        conf.push({ start: ++start, end:  ++end, type_id: ++id, visible: true })
        return conf
    },

    initEventItem(typeId, color){
        return  {
            type_id: typeId,
            item_bg_color: color,
            item_bg_radius: px(10),
            text_view: this.getItemOfEventConfig(),
            text_view_count: 4,
            image_view: this.getActionsBtnsConfig(),
            image_view_count: 2,
            item_height: px(270)
        }
    },

    initCreateBtn(typeId, color){
        return  {
            type_id: typeId,
            item_bg_color: color,
            item_bg_radius: px(10),
            text_view:  [{ x: px(0), y: px(0), w: px(380), h: px(100), key: KEYS.create, color: styleColors.white_smoke, action: true, text_size: px(30), align_h: align.CENTER_H}],
            text_view_count: 1,
            image_view_count: 0,
            item_height: px(100)
        }
    },

    initNavigationBtn(typeId, key, yPos){
        return  {
            type_id: typeId,
            image_view: [{ x: px((400-70)/2), y: px(yPos), w: px(70), h: px(70), key: key, action: true }],
            image_view_count: 1,
            item_height: px(0)
        }
    },

    initItemConfig(){
        const conf  = []
        let id = 0
        conf.push(this.initNavigationBtn(id, KEYS.previous, -65))
        for (const ev of this.data.listOfEvents){
            conf.push(this.initEventItem(++id, ev.color))
        }
        conf.push(this.initCreateBtn(++id,styleColors.dodger_blue))
        conf.push(this.initNavigationBtn(++id, KEYS.next, 25))
        return conf
    }
})