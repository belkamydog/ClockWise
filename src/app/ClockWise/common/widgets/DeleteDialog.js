import { createModal, MODAL_CONFIRM } from '@zos/interaction'
import { push } from '@zos/router'
import { getText } from '@zos/i18n'
import { eventServise } from '../../utils/Globals'


/**
 * Class responsible for handling event deletion dialogs
 */
export class DeleteDialog {

    constructor(event, date, goBackUrl){
        this.#initDeleteDialog(event, date, goBackUrl)
    }

    #createModal(eventId, goBackUrl){
        createModal({
            content: getText('Delete this event') + '?' ,
            autoHide: true,
            show: true,
            onClick: (keyObj) => {
                const { type } = keyObj
                if (type === MODAL_CONFIRM) {
                    eventServise.deleteEvent(eventId)
                    push({
                        url: goBackUrl
                    })
                }
            },
        })
    }

    #initDeleteDialog(event, date, goBackUrl) {
        if (event.check_repeat === 'never') 
            this.#createModal(event.id, goBackUrl)
         else 
            push({
                url: 'page/event/delete/delete_choice',
                params: { id:event.id, date, goBackUrl }
            });
        
    }
}
