import { createWidget, widget, align } from '@zos/ui'
import { getText } from '@zos/i18n'
import { styleColors } from '../utils/Constants'
import { BackBtn } from '../common/widgets/backBtn'
import { PageTitle } from '../common/widgets/PageTitle'

Page({
    widgets:{
      title: null,
      backBtn: null,
    },
    build() {
      this.widgets.title = PageTitle.renderTitle('About')
      createWidget(widget.TEXT, {
        text: getText('App name') + ': ClockWise',
        x: 50,
        y: 120,
        w: 440,
        h: 40,
        text_size: 24,
        align_h: align.LEFT,
        color: styleColors.white_smoke
      })
      createWidget(widget.TEXT, {
        text: getText('Version') + ': 1.0.0',
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
        x: 50,
        y: 220,
        w: 440,
        h: 40,
        text_size: 24,
        align_h: align.LEFT,
        color: styleColors.white_smoke
      })
      createWidget(widget.TEXT, {
        text: getText('Contact') + ': belkamydog22@gmail.com',
        x: 50,
        y: 270,
        w: 480,
        h: 30,
        text_size: 24,
        align_h: align.LEFT,
        color: styleColors.white_smoke
      })
      this.widgets.backBtn = BackBtn.renderBackBtn('Main page', 'page/index')
    }
})