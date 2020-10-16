import debugLogger from 'src/utils/debugLogger'
import i18n from 'boot/i18n'
import _ from 'lodash'
import helper from 'src/utils/helper'

class BaseFileStorage {
  constructor () {
    // init electron store
    this._store = {}
  }

  // Electron Store
  setItemInStore (key, value) {
    return this._store.set(key, value)
  }

  setItemsInStore (settings) {
    if (!settings) {
      debugLogger.Error(i18n.t('updateSettingsWithNullObject'))
      return
    }
    Object.keys(settings).map(key => {
      if (helper.isNullOrEmpty(settings[key])) return null
      this.setItemInStore(key, settings[key])
    })
  }

  getAllItemsFromStore () {
    return this._store.store
  }

  getItemFromStore (key) {
    return this._store.get(key)
  }

  /**
   * get item by key array
   * @param {string[] | Object} keys
   * @returns {*}
   */
  getItemsFromStore (keys) {
    let result = {}
    if (_.isArray(keys)) {
      return keys.map(key => {
        return this.getItemFromStore(key)
      })
    }
    for (const key in keys) {
      if (helper.isNullOrEmpty(key)) continue
      result = {
        ...result,
        [key]: this.getItemFromStore(key)
      }
    }
    return result
  }

  isKeyExistInStore (key) {
    return this._store.has(key)
  }

  removeItemFromStore (key) {
    return this._store.delete(key)
  }

  get size () {
    return this._store.size
  }

  /**
   * 获取缓存在本地的笔记数据
   * @param info 笔记信息
   * @param cacheKey 缓存key
   */
  getCachedNote (info, cacheKey) {
    const { dataModified } = info
    const note = this.getItemFromStore(cacheKey)
    if (helper.isNullOrEmpty(note) || helper.isNullOrEmpty(note.info)) {
      return null
    }
    if (note.info.dataModified === dataModified) {
      note.info = info
      this.setCachedNote(note, cacheKey, note.cachedDate)
      const now = new Date().getTime()
      // 没有资源文件的时候直接返回缓存，如果有资源文件但是缓存时间小于五分钟的也可以使用缓存
      if ((note.resources && note.resources.length === 0) || (note.cachedDate && now - note.cachedDate < 5 * 60 * 1000)) {
        return note
      }
    } else this.removeItemFromStore(cacheKey)
    return null
  }

  /**
   * 设置笔记缓存
   * @param note
   * @param cacheKey
   * @param cachedDate
   */
  setCachedNote (note, cacheKey, cachedDate) {
    this.setItemInStore(cacheKey, { ...note, cachedDate: cachedDate || new Date().getTime() })
  }
}
export default BaseFileStorage
