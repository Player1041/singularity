<template>
  <div class="table-container">
    <table class="camo-table">
      <thead>
      <tr>
        <th class="weapon-name">{{ $t('general.weapon') }}</th>
        <th v-for="camo in activeCamos" :key="camo" class="camo-header">
          <img
            :src="`https://cdn.itchy-beard.co.uk/singularity/camouflages/${camoHeaderImage(
                camo
              )}.png`"
            :alt="camo"
            class="camo-header-image"
            v-tippy="{ content: camo, placement: 'top' }"
            onerror="javascript:this.src='/military-gradient.svg'" />
        </th>
      </tr>
      </thead>
      <tbody v-for="(category, title) in categories" :key="title">
      <tr v-if="!isFavorites" class="category-row">
        <td :colspan="activeCamos.length + 1">
          <div class="category-row-content">
            <span class="category-title">{{ $t('weapon_categories.' + title) }}</span>
            <span class="category-progress">{{ categoryProgress(category) }}</span>
          </div>
        </td>
      </tr>
      <tr v-for="weapon in category" :key="weapon.name" class="weapon-row">
        <td class="weapon-name">
          <IconComponent
            v-if="weapon.comingSoon"
            name="clock"
            size="14"
            v-tippy="{ content: $t('general.coming_soon') }" />
          {{ weapon.name }}
        </td>
        <CamoTableCell
          v-for="camoName in activeCamos"
          :key="camoName"
          :weapon="weapon"
          :camoName="camoName"
          :progressKey="progressKey"
          :isDebugVisible="isDebugVisible" />
      </tr>
      </tbody>
      <tfoot>
      <tr class="debug-toggle-row">
        <td :colspan="activeCamos.length + 1">
            <span @click="isDebugVisible = !isDebugVisible" class="debug-toggle">
              {{
                isDebugVisible
                  ? $t('general.hide_debug')
                  : $t('general.show_debug')
              }}
            </span>
        </td>
      </tr>
      </tfoot>
    </table>
  </div>
</template>

<script>
import camouflageOrder from '@/data/camouflageOrder'
import { convertToKebabCase } from '@/utils/utils'
import CamoTableCell from '@/components/CamoTableCell.vue'
import { mapState } from 'pinia'
import { useStore }
  from '@/stores/store'

export default {
  components: {
    CamoTableCell,
  },

  props: {
    categories: {
      type: Object,
      required: true,
    },
    progressKey: {
      type: String,
      required: true,
    },
    isFavorites: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      isDebugVisible: false,
    }
  },

  computed: {
    ...mapState(useStore, ['filters']),

    activeCamos() {
      const getCamosForMode = (start, end) => {
        const camos = camouflageOrder.slice(start, end)
        return this.filters.hideMilitaryCamos ? camos.slice(9) : camos
      }

      if (this.progressKey === 'multiplayer') return getCamosForMode(0, 16)
      if (this.progressKey === 'zombies') return getCamosForMode(16, 32)
      if (this.progressKey === 'campaign') return getCamosForMode(32, 48)
      if (this.progressKey === 'warzone') return getCamosForMode(48, 64)
      return []
    },
  },

  methods: {
    camoHeaderImage(camoName) {
      return convertToKebabCase(camoName)
    },

    categoryProgress(categoryWeapons) {
      const total = categoryWeapons.filter((weapon) => !weapon.comingSoon).length
      if (total === 0) return ''

      const camosInThisMode = this.activeCamos
      const completed = categoryWeapons.reduce((a, weapon) => {
        if (weapon.comingSoon) return a
        const allComplete = camosInThisMode.every(
          (camo) => weapon.progress[this.progressKey][camo]
        )
        return a + (allComplete ? 1 : 0)
      }, 0)

      return `${completed}/${total}`
    },
  },
}
</script>

<style lang="scss" scoped>
.table-container {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  background: $elevation-1-color;
}

.camo-table {
  border-collapse: collapse;
  width: 100%;
  min-width: 1000px;
  padding: 0;
  margin: 0;

  thead {
    background: $elevation-2-color;
  }

  th,
  td {
    border-bottom: 1px solid $elevation-2-color;
    padding: 6px;
    text-align: center;
    vertical-align: middle;
  }

  th {
    padding: 10px 8px;
    font-size: 12px;
    font-weight: 600;
    color: $text-color;
    opacity: 0.7;
  }

  th.weapon-name {
    width: 200px;
    text-align: left;
    padding-left: 15px;
    position: sticky;
    left: 0;
    z-index: 2;
    background: $elevation-2-color;
    border-right: 1px solid $elevation-3-color;
  }

  .camo-header {
    width: 48px;
    padding: 10px 4px;

    .camo-header-image {
      width: 48px;
      height: 48px;
      border-radius: 4px;
      display: block;
      margin: 0 auto;
      opacity: 1;
    }
  }

  .category-row {
    background: $elevation-1-color;

    td {
      text-align: left;
      padding: 0;
      font-size: 18px;
      font-weight: 600;
      color: $text-color;
      border-top: 1px solid $elevation-3-color;
      border-bottom: 2px solid $elevation-3-color;
    }

    .category-row-content {
      padding: 12px 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .category-title {
      user-select: none;
    }

    .category-progress {
      font-size: 16px;
      color: $elevation-9-color;
    }
  }

  .weapon-row {
    background: $elevation-1-color;

    td.weapon-name {
      text-align: left;
      padding-left: 15px;
      font-weight: 500;
      position: sticky;
      left: 0;
      z-index: 1;
      background: $elevation-1-color;
      border-right: 1px solid $elevation-2-color;
      font-size: 14px;

      .icon-component {
        margin-right: 5px;
        opacity: 0.6;
      }
    }

    &:hover {
      td,
      td.weapon-name {
        background: $elevation-2-color;
      }
    }
  }

  tfoot {
    .debug-toggle-row {
      td {
        padding: 10px;
        text-align: center;
        border-top: 1px solid $elevation-2-color;
      }

      .debug-toggle {
        font-size: 11px;
        color: $elevation-9-color;
        cursor: pointer;
        opacity: 0.6;
        transition: $transition;

        &:hover {
          opacity: 1;
        }
      }
    }
  }
}
</style>