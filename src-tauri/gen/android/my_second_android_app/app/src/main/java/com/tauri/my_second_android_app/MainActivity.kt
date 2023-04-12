package com.tauri.my_second_android_app

import app.tauri.plugin.PluginManager

class MainActivity : TauriActivity() {
  var pluginManager: PluginManager = PluginManager(this)
}
