import { createWidget, widget, prop, align } from '@zos/ui'
import { createModal, MODAL_CONFIRM } from '@zos/interaction'
import { eventServise } from '../utils/Globals';
import { push } from '@zos/router'
import { getText } from '@zos/i18n'
import { HOUR_MS, styleColors } from '../utils/Constants';
import {log} from '@zos/utils'
import { Event } from '../utils/models/Event';
import { onGesture, GESTURE_RIGHT } from '@zos/interaction'
import { EventService } from '../utils/services/EventService';
import { PageIndicator } from '../common/widgets/PageIndicator'
import { PageTitle } from '../common/widgets/PageTitle'


const logger = log.getLogger('page/list.js')

Page({

  registerGes(){
    onGesture({
        callback: (event) => {
          if (event === GESTURE_RIGHT) {
            push({
              url: 'page/calendar',
            })
          }
          return true
        },
      })
  },

  initTitle(date){
    PageTitle.renderTitle('List of events')
  },

  addKeys(arrEv) {
      let result = [];
      const previous = {
          previous: 'previous.png'
      };
      result.push(previous);
      for (const event of arrEv) {
          const eventCopy = { ...event };
          eventCopy.date_period = '🗓️ ' + eventCopy.date_period;
          eventCopy.period = '🕑 ' + eventCopy.period + ' ' + new Event(eventCopy).getDuration();
          eventCopy.weekDay = new Event(eventCopy).getWeekDay();
          eventCopy.del_img = 'delete.png';
          eventCopy.edit_img = 'edit.png';
          switch (eventCopy.check_repeat) {
              case 'never':
                  eventCopy.check_repeat = '';
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
      const next = {
          next: 'next.png'
      };
      result.push(next);
      
      return result;
  },

  ifEmptyListOfEventsLabel(){
    createWidget(widget.TEXT, {
      text: getText('There are no events'),
      x: 0,
      y: 220,
      w: 480,
      h: 50,
      text_size: 35,
      align_h: align.CENTER_H,
      align_v: align.CENTER_V,
      color: styleColors.white
    })
  },

  /**
   * @param params { Date object}
   */
  onInit(params) {
    this.registerGes()
    let date = null
    try{
      date = new Date(params)
    } catch {
      date = new Date()
    }
    const listOfEvents = eventServise.getListOfEvents(date)
    const pageIndicator = new PageIndicator(listOfEvents.length + 2)
    this.initTitle(date);
    const separatedByColorInd = EventService.separateListToPastCurrentFutureEvents(listOfEvents)
    const weekEvents = this.addKeys(listOfEvents)
    logger.log('Init list of events: ' + JSON.stringify(weekEvents))
    if (weekEvents.length == 2) 
        this.ifEmptyListOfEventsLabel()
  
    logger.log('Creating scrollist of events...')
    const scrollList = createWidget(widget.SCROLL_LIST, {
        x: (480-380)/2,
        y: 140,
        h: 450,
        w: 380,
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
            image_view: [{ x: (380-50)/2, y: -70, w: 60, h: 60, key: 'previous', action: true }],
            image_view_count: 1,
            item_height: 0
          },
          {
            type_id: 1,
            item_bg_color: styleColors.dark_gray,
            item_bg_radius: 10,
            text_view: [
              { x: 0, y: 0, w: 380, h: 40, key: 'date_period', color: styleColors.white_smoke, text_size: 30, align_h: align.CENTER_H},
              { x: 0, y: 50, w: 380, h: 40, key: 'period', color: styleColors.white_smoke, text_size: 30, align_h: align.CENTER_H},
              { x: 0, y: 80, w: 380, h: 80, key: 'description', color: styleColors.white_smoke, text_size: 40, align_h: align.CENTER_H},
              { x: 0, y: 150, w: 380, h: 40, key: 'weekDay', color: styleColors.white_smoke, text_size: 30, align_h: align.CENTER_H},
              { x: 0, y: 200, w: 380, h: 40, key: 'status', color: styleColors.white_smoke, text_size: 30, align_h: align.CENTER_H},
              { x: 0, y: 250, w: 380, h: 40, key: 'check_repeat', color: styleColors.white_smoke, text_size: 30, align_h: align.CENTER_H},
            ],
            text_view_count: 6,
            image_view: [
              { x:410, y: 20, w: 64, h: 64, key: 'del_img', action: true },
              { x:410, y: 150, w: 64, h: 64, key: 'edit_img', action: true }
            ],
            image_view_count: 2,
            item_height: 300
          },
          {
            type_id: 2,
            item_bg_color: styleColors.dark_green,
            item_bg_radius: 10,
            text_view: [
              { x: 0, y: 0, w: 380, h: 40, key: 'date_period', color: styleColors.white_smoke, text_size: 30, align_h: align.CENTER_H},
              { x: 0, y: 50, w: 380, h: 40, key: 'period', color: styleColors.white_smoke, text_size: 30, align_h: align.CENTER_H},
              { x: 0, y: 80, w: 380, h: 80, key: 'description', color: styleColors.white_smoke, text_size: 40, align_h: align.CENTER_H},
              { x: 0, y: 150, w: 380, h: 40, key: 'weekDay', color: styleColors.white_smoke, text_size: 30, align_h: align.CENTER_H},
              { x: 0, y: 200, w: 380, h: 40, key: 'status', color: styleColors.white_smoke, text_size: 30, align_h: align.CENTER_H},
              { x: 0, y: 250, w: 380, h: 40, key: 'check_repeat', color: styleColors.white_smoke, text_size: 30, align_h: align.CENTER_H},
            ],
            text_view_count: 6,
            image_view: [
              { x:410, y: 20, w: 64, h: 64, key: 'del_img', action: true },
              { x:410, y: 150, w: 64, h: 64, key: 'edit_img', action: true }
            ],
            image_view_count: 2,
            item_height: 300
          },
          {
            type_id: 3,
            item_bg_color: styleColors.dark_blue,
            item_bg_radius: 10,
            text_view: [
              { x: 0, y: 0, w: 380, h: 40, key: 'date_period', color: styleColors.white_smoke, text_size: 30, align_h: align.CENTER_H},
              { x: 0, y: 50, w: 380, h: 40, key: 'period', color: styleColors.white_smoke, text_size: 30, align_h: align.CENTER_H},
              { x: 0, y: 80, w: 380, h: 80, key: 'description', color: styleColors.white_smoke, text_size: 40, align_h: align.CENTER_H},
              { x: 0, y: 150, w: 380, h: 40, key: 'weekDay', color: styleColors.white_smoke, text_size: 30, align_h: align.CENTER_H},
              { x: 0, y: 200, w: 380, h: 40, key: 'status', color: styleColors.white_smoke, text_size: 30, align_h: align.CENTER_H},
              { x: 0, y: 250, w: 380, h: 40, key: 'check_repeat', color: styleColors.white_smoke, text_size: 30, align_h: align.CENTER_H},
            ],
            text_view_count: 6,
            image_view: [
              { x:410, y: 20, w: 64, h: 64, key: 'del_img', action: true },
              { x:410, y: 150, w: 64, h: 64, key: 'edit_img', action: true }
            ],
            image_view_count: 2,
            item_height: 300
          },
          {
            type_id: 4,
            item_bg_color: styleColors.brown,
            item_bg_radius: 75,
            image_view: [{ x: (380-50)/2, y: 10, w: 80, h: 80, key: 'next', action: true }],
            image_view_count: 1,
            item_height: 0
          },
        ],
        item_config_count: 5,
        data_array: weekEvents,
        data_count: weekEvents.length,
        item_focus_change_func: (list, index, focus) => {
          pageIndicator.updatePageIndicator(index)
        },
        item_click_func: (item, index, data_key) => {
          if (data_key === 'del_img') {
                const deleteDialog = createModal({
                  content: getText('Delete this event') + '?',
                  autoHide: false,
                  show: false,
                  onClick: (keyObj) => {
                      const { type } = keyObj
                      if (type === MODAL_CONFIRM) {
                        eventServise.deleteEvent(weekEvents[index].id)
                        scrollList.setProperty(prop.DELETE_ITEM, { index })
                        logger.log('Delete event: ' + JSON.stringify(weekEvents[index]))
                        deleteDialog.show(false)
                      } else {
                          logger.log('Delete canceled')
                          deleteDialog.show(false)
                      }
                  },
                })
                deleteDialog.show(true) 
          }
          else if (data_key === 'next'){
            const newDate = new Date(new Date(params).getTime() + 24 * HOUR_MS)
            push({
              url: 'page/list',
              params: newDate
            })
          }
          else if (data_key === 'previous'){
            const newDate = new Date(new Date(params).getTime() - 24 * HOUR_MS)
            push({
              url: 'page/list',
              params: newDate
            })
          }
          else if (data_key == 'edit_img'){
            logger.log('Calling edit menu...')
            push({
              url: 'page/event/edit/menu',
              params: JSON.stringify(listOfEvents[index-1])
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
            end: weekEvents.length - 1,
            type_id: 3,
            visible: separatedByColorInd.future > 0
          },
          {
            start: weekEvents.length-1,
            end: weekEvents.length-1,
            type_id: 4
          }
        ],
        data_type_config_count: 5
    })
  }
})