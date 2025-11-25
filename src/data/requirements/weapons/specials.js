import specials from '@/data/weapons/specials'
import {
  MP_BASE_CAMOS_MELEE,
  MP_MASTERY_CAMOS,
  ZM_BASE_CAMOS_LAUNCHER_MELEE,
  ZM_MASTERY_CAMOS,
  CP_BASE_CAMOS_LAUNCHER_MELEE,
  CP_MASTERY_CAMOS,
  WZ_BASE_CAMOS,
  WZ_MASTERY_CAMOS,
} from '../../camouflages/definitions'

const specialCamouflages = {
  "NX Ravager": {
    "multiplayer": {
      "Diamondback": { "type": "TBD" },
      "Raptor": { "type": "TBD" },
      "Mainframe": { "type": "TBD" }
    },
    "zombies": {
      "Mutilate": { "type": "TBD" },
      "Slither": { "type": "TBD" },
      "Pathfinder": { "type": "TBD" }
    },
    "campaign": {
      "Cinder": { "type": "TBD" },
      "Caiman": { "type": "TBD" },
      "Network": { "type": "TBD" }
    },
    "warzone": {
      "Shimmer": { "type": "TBD" },
      "Tyrant": { "type": "TBD" },
      "Trace": { "type": "TBD" }
    }
  }
}

export default {
  ...specials.reduce((acc, weapon) => {
    acc[weapon] = {
      multiplayer: {
        ...MP_BASE_CAMOS_MELEE,
        ...specialCamouflages[weapon].multiplayer,
        ...MP_MASTERY_CAMOS,
      },
      zombies: {
        ...ZM_BASE_CAMOS_LAUNCHER_MELEE,
        ...specialCamouflages[weapon].zombies,
        ...ZM_MASTERY_CAMOS,
      },
      campaign: {
        ...CP_BASE_CAMOS_LAUNCHER_MELEE,
        ...specialCamouflages[weapon].campaign,
        ...CP_MASTERY_CAMOS,
      },
      warzone: {
        ...WZ_BASE_CAMOS,
        ...specialCamouflages[weapon].warzone,
        ...WZ_MASTERY_CAMOS,
      }
    }
    return acc
  }, {}),
}