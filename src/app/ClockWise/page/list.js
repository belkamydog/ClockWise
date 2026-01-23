import { createWidget, widget, align } from '@zos/ui'
import { eventServise } from '../utils/Globals';
import { push } from '@zos/router'
import { getText } from '@zos/i18n'
import { HOUR_MS, MONTH_SHORT, styleColors, WEEK_DAYS_SHORT } from '../utils/Constants';
import {log} from '@zos/utils'
import { Event } from '../utils/models/Event';
import { onGesture, GESTURE_RIGHT } from '@zos/interaction'
import { EventService } from '../utils/services/EventService';
import { PageIndicator } from '../common/widgets/PageIndicator'
import { PageTitle } from '../common/widgets/PageTitle'
import {BackBtn} from '../common/widgets/backBtn'
import { DeleteDialog } from '../common/widgets/DeleteDialog';


const logger = log.getLogger('page/list.js')

Page({
  widgets: {
    title: null,
    date: null,
    backBtn: null,
    scrolEventsList: null,
    pageIndicator: null,
  },
  data: {
    date: null,
    listOfEvents: null,
  },

  registerGes(){
    onGesture({
        callback: (event) => {
          if (event === GESTURE_RIGHT) {}
          return true
        },
      })
  },

  initTitle(date){
    this.widgets.title = PageTitle.renderTitle('List of events')
    const dateText = '🗓️ ' + 
                    date.getDate() + ' ' +
                    getText(MONTH_SHORT[date.getMonth()]) + ' ' +
                    getText(WEEK_DAYS_SHORT[date.getDay()])
    this.widgets.date = createWidget(widget.TEXT, {
      text: dateText,
      w: 480,
      x: 0,
      y: 20,
      text_size: 25,
      align_h: align.CENTER_H,
    })
    
  },

  addKeys(listOfEvents) {
      let result = [];
      result.push({previous: 'previous.png'});
      for (const event of listOfEvents) {
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
      result.push({ next: 'next.png'});
      
      return result;
  },

  ifEmptyListOfEventsLabel(){
    createWidget(widget.TEXT, {
      text: getText('There are no events'),
      x: 0,
      y: 220,
      w: 480,
      h: 50,
      radius: 200,
      start_angle: 0,
      end_angle_: 90,
      text_size: 35,
      align_h: align.CENTER_H,
      align_v: align.CENTER_V,
      color: styleColors.dark_gray
    })
  },

  renderBackBtn(){
    this.widgets.backBtn = BackBtn.renderBackBtn('Back', 'page/calendar')
    const onClick = () => { push({ url:'page/calendar', params: date})}
    this.widgets.backBtn.click_func = onClick
  },

  getDateOfEvents(dateString){
    try{
      return new Date(dateString)
    } catch {
      return new Date()
    }
  },

  onInit(params) {
    logger.log('Creating scrollist of events...')
    this.registerGes()
    let date = this.getDateOfEvents(params)
    this.initTitle(date);
    const listOfEvents = eventServise.getListOfEvents(date)
    const separatedByColorInd = EventService.separateListToPastCurrentFutureEvents(listOfEvents)
    const dayEvents = this.addKeys(listOfEvents)
    this.widgets.pageIndicator = new PageIndicator(dayEvents.length)
    if (dayEvents.length == 2) this.ifEmptyListOfEventsLabel()
    const itemOfEvent = [
      { x: 0, y: 10, w: 380, h: 40, key: 'period', color: styleColors.white_smoke, text_size: 30, align_h: align.CENTER_H},
      { x: 0, y: 50, w: 380, h: 80, key: 'description', color: styleColors.white_smoke, text_size: 40, align_h: align.CENTER_H},
      { x: 0, y: 130, w: 380, h: 40, key: 'status', color: styleColors.white_smoke, text_size: 30, align_h: align.CENTER_H},
      { x: 0, y: 190, w: 380, h: 40, key: 'check_repeat', color: styleColors.white_smoke, text_size: 30, align_h: align.CENTER_H}
    ]
    const actionEventBtns = [
        { x:410, y: 20, w: 64, h: 64, key: 'del_img', action: true },
        { x:410, y: 150, w: 64, h: 64, key: 'edit_img', action: true }
    ]
    this.widgets.scrolEventsList = createWidget(widget.SCROLL_LIST, {
        x: (480-380)/2,
        y: 110,
        h: 270,
        w: 370,
        radius:10,
        item_space: 10,
        snap_to_center: true,
        item_enable_horizon_drag: true,
        item_drag_max_distance: -120,
        item_config: [
          {
            type_id: 0,
            item_bg_color: styleColors.brown,
            item_bg_radius: 75,
            image_view: [{ x: (380-50)/2, y: -75, w: 60, h: 60, key: 'previous', action: true }],
            image_view_count: 1,
            item_height: 0
          },
          {
            type_id: 1,
            item_bg_color: styleColors.dark_gray,
            item_bg_radius: 10,
            text_view: itemOfEvent,
            text_view_count: 4,
            image_view: actionEventBtns,
            image_view_count: 2,
            item_height: 270
          },
          {
            type_id: 2,
            item_bg_color: styleColors.dark_green,
            item_bg_radius: 10,
            text_view: itemOfEvent,
            text_view_count: 4,
            image_view: actionEventBtns,
            image_view_count: 2,
            item_height: 270
          },
          {
            type_id: 3,
            item_bg_color: styleColors.dark_blue,
            item_bg_radius: 10,
            text_view: itemOfEvent,
            text_view_count: 4,
            image_view: actionEventBtns,
            image_view_count: 2,
            item_height: 270
          },
          {
            type_id: 4,
            item_bg_color: styleColors.brown,
            item_bg_radius: 75,
            image_view: [{ x: (380-50)/2, y: 15, w: 80, h: 80, key: 'next', action: true }],
            image_view_count: 1,
            item_height: 0
          },
        ],
        item_config_count: 5,
        data_array: dayEvents,
        data_count: dayEvents.length,
        item_focus_change_func: (list, index, focus) => {
          this.widgets.pageIndicator.updatePageIndicator(index)
        },
        item_click_func: (item, index, data_key) => {
          if (data_key === 'del_img')
            new DeleteDialog(listOfEvents[index-1], date, 'page/calendar')
          else if (data_key == 'edit_img')
            push({
              url: 'page/event/edit/menu',
              params: JSON.stringify(listOfEvents[index-1])
            })
          else {
            let newDate = null;
            if (data_key === 'next')
              newDate = new Date(new Date(params).getTime() + 24 * HOUR_MS)
            else if (data_key === 'previous')
              newDate = new Date(new Date(params).getTime() - 24 * HOUR_MS)
            push({
              url: 'page/list',
              params: newDate
            })
          }
        },
        data_type_config: [
          {
            start: 0,
            end:  0,
            type_id: 0
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
            end: dayEvents.length - 1,
            type_id: 3,
            visible: separatedByColorInd.future > 0
          },
          {
            start: dayEvents.length-1,
            end: dayEvents.length-1,
            type_id: 4
          }
        ],
        data_type_config_count: 5
    })
    this.renderBackBtn()
  }
})