import { setScrollMode, SCROLL_MODE_SWIPER_HORIZONTAL } from '@zos/page'
import { createWidget, widget, prop, align, event } from '@zos/ui'
import { onGesture, GESTURE_RIGHT } from '@zos/interaction'
import { push, launchApp, exit } from '@zos/router'
import { BasePage } from '@zeppos/zml/base-page'
import { getText } from '@zos/i18n'
import { Time } from '@zos/sensor'
import {log, px } from '@zos/utils'

import { HOUR_MS, SCREEN_SIZE, WEEK_DAYS_SHORT } from '../utils/Constants';
import { EventService } from '../utils/services/EventService'
import { eventServise, wfNumbers} from '../utils/Globals';
import { Event } from '../utils/models/Event';
import { styleColors } from '../utils/Constants'
import { MainMenu } from './menu'


const logger = log.getLogger('Main page')

Page(
  BasePage({
    widgets: {
      pageIndicator: null,
      canvasColor: null,
      canvas: null,
      background: null,
      hourArrow: null,
      destroyArrow: null,
      minuteArrow: null,
      digitTime: null,
      date: null,
      wfNumbers: {
        _0: null,
        _1: null,
        _2: null,
        _3: null,
        _4: null,
        _5: null,
        _6: null,
        _7: null,
        _8: null,
        _9: null,
        _10: null,
        _11: null,
      },
    },

    initColorCanvas() {
      this.widgets.canvasColor = createWidget(widget.CANVAS, {
        x: px(0),
        y: px(0),
        w: px(SCREEN_SIZE),
        h: px(SCREEN_SIZE),
        alpha: 255,
      })
    },

    initBg() {
      createWidget(widget.CIRCLE, {
        center_x: px(SCREEN_SIZE/2),
        center_y: px(SCREEN_SIZE/2),
        radius: px(SCREEN_SIZE/2),
        color: styleColors.dark_gray,
      })
      createWidget(widget.CIRCLE, {
        center_x: px(SCREEN_SIZE/2),
        center_y: px(SCREEN_SIZE/2),
        radius: px((SCREEN_SIZE/2)-5),
        color: styleColors.black,
      })
    },

    initWfNumbers() {
      const centerX = px(SCREEN_SIZE/2);
      const centerY = px(SCREEN_SIZE/2);
      const radius = px((SCREEN_SIZE/2)-45);
      wfNumbers.initWatchFace(new Date().getHours())
      const numbers = wfNumbers.getTimePointDigits()
      let angle = -90
      for (let i = 0; i < 12; i++){
        const angleInRadians = angle * Math.PI / 180;
        const x = centerX + radius * Math.cos(angleInRadians) - 20;
        const y = centerY + radius * Math.sin(angleInRadians) - 20;
        let value = numbers[i]
        let size = 40
        if (numbers[i] == 12) {
          size = 30
          value = '☀️'
        }
        else if (numbers[i] == 0){
          size = 30
          value = '🌙'
        } 
        angle += 30
        this.widgets.wfNumbers[`_${i}`] = createWidget(widget.TEXT, {
          x: px(Math.round(x)),
          y: px(Math.round(y)),
          w: px(52),
          h: px(52),
          color: 0xFFFFFF,
          font: 'fonts/Digiface (Rus by MarkStarikov2014) Regular.ttf',
          text_size: px(size),
          align_h: align.CENTER_H,
          align_v: align.CENTER_V,
          text: value
        });
      }
    },

    initArrows() {
      this.widgets.destroyArrow = createWidget(widget.IMG, {
        x: px(0),
        y: px(0),
        h: px(SCREEN_SIZE),
        w: px(SCREEN_SIZE),
        center_x: px(SCREEN_SIZE/2),
        center_y: px(SCREEN_SIZE/2),
        pos_x: px(SCREEN_SIZE/2),
        pos_y: px(0),
        angle: EventService.convertTimeToAngle(new Date() - HOUR_MS*2),
        src: 'arrows/deadLine.png'
      })
      this.widgets.hourArrow = createWidget(widget.TIME_POINTER, {
        hour_centerX: px(SCREEN_SIZE/2),
        hour_centerY: px(SCREEN_SIZE/2),
        hour_posX: px(2),
        hour_posY: px(SCREEN_SIZE/2),
        hour_path: 'arrows/hour.png',
        minute_centerX: px(SCREEN_SIZE/2),
        minute_centerY: px(SCREEN_SIZE/2),
        minute_posX: px(2),
        minute_posY: px(SCREEN_SIZE/2),
        minute_path: 'arrows/minute.png',
      })
    },

    initCanvas() {
      this.widgets.canvas = createWidget(widget.CANVAS, {
        x: px(0),
        y: px(0),
        w: px(SCREEN_SIZE),
        h: px(SCREEN_SIZE),
        alpha: 0
      })
      this.widgets.canvas.addEventListener(event.CLICK_UP, (info) => {
        const eventsArray = []
        const actuals = eventServise.getActualEvents()
        actuals.sort((a, b) => (b.endAngle - (b.endAngle < b.startAngle ? 360 : 0) - b.startAngle) - (a.endAngle - (a.endAngle < a.startAngle ? 360 : 0) - a.startAngle))
        for (const event of actuals) {
          if (EventService.isThisEvent(info.x, info.y, event)) {
            eventsArray.push(event)
          }
        }
        if (eventsArray.length > 0) {
          push({
            url: 'page/event',
            params: JSON.stringify(eventsArray),
          })
        }
      })
    },

    initCentralCircle() {
      createWidget(widget.CIRCLE, {
        center_x: px(SCREEN_SIZE/2),
        center_y: px(SCREEN_SIZE/2),
        radius: px(111),
        color: styleColors.dark_gray,
      })
      createWidget(widget.CIRCLE, {
        center_x: px(SCREEN_SIZE/2),
        center_y: px(SCREEN_SIZE/2),
        radius: px(105),
        color: styleColors.black,
      })
      
      // Цифровое время
      const timeSensor = new Time()
      this.widgets.digitTime = createWidget(widget.TEXT, {
        x: px((SCREEN_SIZE-190)/2),
        y: px((SCREEN_SIZE-170)/2),
        w: px(180),
        h: px(180),
        color: styleColors.white_smoke,
        text_size: px(70),
        font: 'fonts/Digiface (Rus by MarkStarikov2014) Regular.ttf',
        align_h: align.CENTER_H,
        align_v: align.CENTER_V,
        text: Event.addZero(timeSensor.getHours().toString()) + ':' + Event.addZero(timeSensor.getMinutes().toString())
      })
      
      // Дата
      const now = new Date()
      this.widgets.date = createWidget(widget.TEXT, {
        x: px((SCREEN_SIZE-180)/2),
        y: px(95),
        w: px(180),
        h: px(180),
        color: styleColors.white_smoke,
        text_size: px(40),
        font: 'fonts/Digiface (Rus by MarkStarikov2014) Regular.ttf',
        align_h: align.CENTER_H,
        align_v: align.CENTER_V,
        text: Event.addZero(now.getDate().toString()) + 
          '.' + Event.addZero((now.getMonth()+1).toString())
      })
      
      this.widgets.date.addEventListener(event.SELECT, () => {
        launchApp({
          appId: SYSTEM_APP_CALENDAR,
          native: true
        })
      })

      // День недели
      createWidget(widget.TEXT, {
        x: (SCREEN_SIZE-180)/2,
        y: 210,
        w: 180,
        h: 180,
        color: styleColors.white_smoke,
        text_size: 40,
        font: 'fonts/Digiface (Rus by MarkStarikov2014) Regular.ttf',
        align_h: align.CENTER_H,
        align_v: align.CENTER_V,
        text: getText(WEEK_DAYS_SHORT[now.getDay()])
      })

      const time = new Time()
      time.onPerMinute(() => {
        this.updateWidgets()
      })
    },

    updateWfNumbers() {
      logger.log('Wf numbers updated')
      wfNumbers.updateWatchFaceDigit(new Date().getHours())
      const numbers = wfNumbers.getTimePointDigits()
      for (let i = 0; i < 12; i++) {
        if (numbers[i] == 12) {
          this.widgets.wfNumbers[`_${i}`].setProperty(prop.TEXT, '☀️') 
        } else if (numbers[i] == 0) {
          this.widgets.wfNumbers[`_${i}`].setProperty(prop.TEXT, '🌙')
        } else {
          this.widgets.wfNumbers[`_${i}`].setProperty(prop.TEXT, numbers[i])
        }
      }
    },

    updateWidgets() {
      logger.log('updating main page ...')
      const now = new Date()
      
      this.updateWfNumbers()
      this.widgets.destroyArrow.setProperty(prop.ANGLE, EventService.convertTimeToAngle(now - HOUR_MS * 2))
      this.widgets.digitTime.setProperty(prop.TEXT, 
                                Event.addZero(now.getHours().toString()) + 
                                ':' +
                                Event.addZero(now.getMinutes().toString()))
      
      this.widgets.date.setProperty(prop.TEXT, 
        Event.addZero(now.getDate().toString()) + 
        '.' + Event.addZero((now.getMonth()+1).toString()))
      this.widgets.canvasColor.clear({
        x: px(0),
        y: px(0),
        w: px(SCREEN_SIZE),
        h: px(SCREEN_SIZE)
      })
      
      this.widgets.canvas.clear({
        x: 0,
        y: 0,
        w: SCREEN_SIZE,
        h: SCREEN_SIZE
      })
      
      this.renderEvents(eventServise.getActualEvents())
      logger.log('main page updated')
    },

    drawEvent(event) {
      this.widgets.canvasColor.drawArc({
        center_x: px(SCREEN_SIZE/2),
        center_y: px(SCREEN_SIZE/2),
        radius_x: px((SCREEN_SIZE/2)-5),
        radius_y: px((SCREEN_SIZE/2)-5),
        start_angle: event.startAngle-90,
        end_angle: event.endAngle-90,
        color: event.color
      })
      
      this.widgets.canvas.drawArc({
        center_x: px(SCREEN_SIZE/2),
        center_y: px(SCREEN_SIZE/2),
        radius_x: px((SCREEN_SIZE/2)-5),
        radius_y: px((SCREEN_SIZE/2)-5),
        start_angle: event.startAngle-90,
        end_angle: event.endAngle-90,
        color: event.color
      })
    },

    renderEvents(events) {
      events.sort((a, b) => (b.endAngle - (b.endAngle < b.startAngle ? 360 : 0) - b.startAngle) - (a.endAngle - (a.endAngle < a.startAngle ? 360 : 0) - a.startAngle))
      for (const event of events) {
        this.drawEvent(event);
      }
    },

    renderPageIndicator() {
      this.widgets.pageIndicator = createWidget(widget.PAGE_INDICATOR, {
          x: px(5),
          y: px(15),
          w: px(SCREEN_SIZE),
          h: px(10),
          align_h: align.CENTER_H,
          h_space: px(10),
          select_src: 'indicator/select.png',
          unselect_src: 'indicator/unselect.png'
      })
    },

    registerGes(){
        onGesture({
            callback: (event) => {
            if (event === GESTURE_RIGHT) {
              exit()
            }
            return true
            },
        })
    },
    onInit(params) { 
      this.registerGes()
      setScrollMode({
          mode: SCROLL_MODE_SWIPER_HORIZONTAL,
          options: {
              width: px(SCREEN_SIZE + 20),
              count: 2
          }
      })
      this.initBg()
      this.initColorCanvas()
      this.initWfNumbers()
      this.initArrows()
      this.initCanvas()
      this.renderEvents(eventServise.getActualEvents())
      this.initCentralCircle()
      this.renderPageIndicator()
      const menu = new MainMenu()
    }
  })
)