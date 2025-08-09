import { DEFAULT_EASE } from "./constant"


const transition = {
    ease: DEFAULT_EASE,
}

export const bgAnimation = {
    closed:{
        opacity: 0,
        transition
    },
    opened:{
        opacity: 1,
        transition
    }

}


export const modalAnimation = {
    closed:{
        
        y: -100,
        transition
    },
    opened:{
        
        y: 0,
        transition
    },
    exited:{
        y: 100,
        transition
    }
}


export const colorPickerAnimation = {

    from:{
        y:-30,
        opacity: 0,
        transition:{
            duration: 0.2,
            ease: DEFAULT_EASE
        }
    },
    to:{
        y: 0,
        opacity: 1,
        transition:{
            duration: 0.2,
            ease: DEFAULT_EASE
        }
    }

}