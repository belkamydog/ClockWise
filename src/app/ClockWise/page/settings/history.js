import { onGesture, GESTURE_RIGHT, createModal, MODAL_CONFIRM} from '@zos/interaction'
import { createWidget, widget, align, prop } from '@zos/ui'
import { getText } from '@zos/i18n'
import { back } from '@zos/router'
import { px } from '@zos/utils'
import { AUTO_DELETE, SCREEN_SIZE, styleColors } from '../../utils/Constants'
import { SettingsService } from '../../utils/services/SettingsService'
import { PageIndicator } from '../../common/widgets/PageIndicator'
import { PageTitle } from '../../common/widgets/PageTitle'
import { BackBtn } from '../../common/widgets/backBtn'




let index_auto_delete = 0
Page({
    actions: ['Never','Older than day', 'Older than week', 'Older than month'],
    widgets:{
        viewContainer: null,
        pageIndicator: null,
        title: null,
        apply: null,
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
    attentionDialog(){
        const attention = getText('Attention! Some events can be deleted!') 
        const dialog = createModal({
            content: attention,
            autoHide: false,
            show: false,
            onClick: (keyObj) => {
                const { type } = keyObj
                if (type === MODAL_CONFIRM) {
                    let settings = SettingsService.loadSettings()
                    settings.autoDelete = AUTO_DELETE[index_auto_delete]
                    SettingsService.saveSettings(settings)
                    dialog.show(false)
                    back()
                } else {
                    dialog.show(false)
                }
            },
        })
        dialog.show(true) 
    },

    initDeleteRadioGroup(){
        const radioGroup = this.widgets.viewContainer.createWidget(widget.RADIO_GROUP, {
            x: px(0),
            y: px(0),
            w: px(480),
            h: px(480),
            select_src: 'radio_selected.png',
            unselect_src: 'radio_unselected.png',
            check_func: (group, index, checked) => {
                if (checked){
                    index_auto_delete = index
                } 
            }
        })
        const x = 380
        const neverDelete = radioGroup.createWidget(widget.STATE_BUTTON, {
            x: px(x),
            y: px(150),
            w: px(64),
            h: px(64)
        })
        const dayDelete = radioGroup.createWidget(widget.STATE_BUTTON, {
            x: px(x),
            y: px(250),
            w: px(64),
            h: px(64)
        })
        const weekDelete = radioGroup.createWidget(widget.STATE_BUTTON, {
            x: px(x),
            y: px(350),
            w: px(64),
            h: px(64)
        })
        const monthDelete = radioGroup.createWidget(widget.STATE_BUTTON, {
            x: px(x),
            y: px(450),
            w: px(64),
            h: px(64)
        })


        const neverDeleteLabel = this.widgets.viewContainer.createWidget(widget.TEXT, {
            text: getText(this.actions[0]),
            w: px(250),
            h: px(135),
            x: px(70),     
            y: px(140),
            align_v: align.UP,
            align_h: align.LEFT,
            text_size: px(32),
            color: styleColors.white_smoke
        })
        const dayDeleteLabel = this.widgets.viewContainer.createWidget(widget.TEXT, {
            text: getText(this.actions[1]),
            w: px(250),
            h: px(64),
            x: px(70),
            y: px(240),
            align_v: align.CENTER_V,
            align_h: align.LEFT,
            text_size: px(32),
            color: styleColors.white_smoke
        })
        const weekDeleteLabel = this.widgets.viewContainer.createWidget(widget.TEXT, {
            text: getText(this.actions[2]),
            w: px(250),
            h: px(64),
            x: px(70),
            y: px(340),
            align_v: align.CENTER_V,
            align_h: align.LEFT,
            text_size: px(32),
            color: styleColors.white_smoke
        })
        const monthDeleteLabel = this.widgets.viewContainer.createWidget(widget.TEXT, {
            text: getText(this.actions[3]),
            w: px(250),
            h: px(64),
            x: px(70),
            y: px(440),
            align_v: align.CENTER_V,
            align_h: align.LEFT,
            text_size: px(32),
            color: styleColors.white_smoke
        })

        if (AUTO_DELETE.indexOf(SettingsService.loadSettings().autoDelete) == 0)
            radioGroup.setProperty(prop.INIT, neverDelete)
        else if (AUTO_DELETE.indexOf(SettingsService.loadSettings().autoDelete) == 1) 
            radioGroup.setProperty(prop.INIT, dayDelete)                
        else if (AUTO_DELETE.indexOf(SettingsService.loadSettings().autoDelete) == 2) 
            radioGroup.setProperty(prop.INIT, weekDelete)
        else if (AUTO_DELETE.indexOf(SettingsService.loadSettings().autoDelete) == 3) 
            radioGroup.setProperty(prop.INIT, monthDelete)
    },
    
    onInit(){
        this.registerGes()
        this.widgets.title = PageTitle.renderTitle('Delete events:')
        this.widgets.viewContainer = createWidget(widget.VIEW_CONTAINER, {
            x: px(0),
            y: px(100),
            w: px(SCREEN_SIZE),
            h: px(280),
            scroll_enable: 1,
            page: 0,
            pos_y: px(-120),
            scroll_frame_func: () => {
                let y =  Math.abs(this.widgets.viewContainer.getProperty(prop.POS_Y))
                let index = y / (300 / 4)
                this.widgets.pageIndicator.updatePageIndicator(index)
            }
        });
        this.widgets.pageIndicator = new PageIndicator(this.actions.length)
        this.initDeleteRadioGroup()
        this.widgets.backBtn = BackBtn.renderBackBtn('Apply', 'page/settings/menu') 
        const click_func = () => {
            if (index_auto_delete > 0){
                this.attentionDialog()
            } else {
                const settings = SettingsService.loadSettings()
                settings.autoDelete = AUTO_DELETE[index_auto_delete]
                SettingsService.saveSettings(settings)
                back()
            }
        }
        this.widgets.backBtn.click_func = click_func
    }
}) 