import { onGesture, GESTURE_RIGHT } from '@zos/interaction'
import { createWidget, widget, align } from '@zos/ui'
import { getText } from '@zos/i18n'
import { px } from '@zos/utils'
import { PageTitle } from '../common/widgets/PageTitle'
import { BackBtn } from '../common/widgets/backBtn'
import { styleColors } from '../utils/Constants'

Page({
    widgets:{
      title: null,
      backBtn: null,
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


    onInit() {
      this.registerGes()
      this.widgets.title = PageTitle.renderTitle('About')
      createWidget(widget.TEXT, {
        text: getText('App name') + ': ClockWise',
        x: px(50),
        y: px(120),
        w: px(440),
        h: px(40),
        text_size: px(24),
        align_h: align.LEFT,
        color: styleColors.white_smoke
      })
      createWidget(widget.TEXT, {
        text: getText('Version') + ': 1.1',
        x: 50,
        y: 170,
        w: 440,
        h: 40,
        text_size: 24,
        align_h: align.LEFT,
        color: styleColors.white_smoke
      })
      createWidget(widget.TEXT, {
        text: getText('Developer') + ': belkamydog',
        x: px(50),
        y: px(220),
        w: px(440),
        h: px(40),
        text_size: px(24),
        align_h: align.LEFT,
        color: styleColors.white_smoke
      })
      createWidget(widget.TEXT, {
        text: getText('Contact') + ': belkamydog22@gmail.com',
        x: px(50),
        y: px(270),
        w: px(480),
        h: px(30),
        text_size: px(24),
        align_h: align.LEFT,
        color: styleColors.white_smoke
      })
      this.widgets.backBtn = BackBtn.renderBackBtn('Main page', 'page/index')
    }
})