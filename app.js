// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    wx.loadFontFace({
      global: true,
      family: 'SF Pro Display',
      source: 'url("https://madestsamurai.github.io/SF-Pro-Display-Regular.woff")',
      desc: {
        weight: 400
      },
    });

    wx.loadFontFace({
      global: true,
      family: 'Pingfang SC',
      source: 'url("https://madestsamurai.github.io/Pingfang_Regular.woff")',
      desc: {
        weight: 300
      },
    });

    wx.loadFontFace({
      global: true,
      family: 'Pingfang SC',
      source: 'url("https://madestsamurai.github.io/Pingfang_Bold.woff")',
      desc: {
        weight: 600
      },
    });

    wx.loadFontFace({
      global: true,
      family: 'Pingfang SC',
      source: 'url("https://madestsamurai.github.io/Pingfang_Heavy.woff")',
      desc: {
        weight: 700
      },
    });

    wx.loadFontFace({
      global: true,
      family: 'SF Pro Display',
      source: 'url("https://madestsamurai.github.io/SF-Pro-Display-Semibold.woff")',
      desc: {
        weight: 600
      },
    });

    wx.loadFontFace({
      global: true,
      family: 'SF Pro Display',
      source: 'url("https://madestsamurai.github.io/SF-Pro-Display-Bold.woff")',
      desc: {
        weight: 700
      },
    });

    wx.loadFontFace({
      global: true,
      family: 'SF Pro Display',
      source: 'url("https://madestsamurai.github.io/SF-Pro-Display-Thin.woff")',
      desc: {
        weight: 300
      },
    });

    wx.loadFontFace({
      global: true,
      family: 'SF Pro Display',
      source: 'url("https://madestsamurai.github.io/SF-Pro-Display-Light.woff")',
      desc: {
        weight: 300
      },
    });

    wx.loadFontFace({
      global: true,
      family: 'SF Pro Display',
      source: 'url("https://madestsamurai.github.io/SF-Pro-Display-Ultralight.woff")',
      desc: {
        weight: 200
      },
    });

    wx.loadFontFace({
      global: true,
      family: 'SF Pro Display',
      source: 'url("https://madestsamurai.github.io/SF-Pro-Display-Heavy.woff")',
      desc: {
        weight: 800
      },
    });

    wx.loadFontFace({
      global: true,
      family: 'SF Pro Display',
      source: 'url("https://madestsamurai.github.io/SF-Pro-Display-Black.woff")',
      desc: {
        weight: 900
      },
    });

    wx.loadFontFace({
      global: true,
      family: 'Pingfang SC',
      source: 'url("https://madestsamurai.github.io/Pingfang_Light.woff")',
      desc: {
        weight: 200
      },
    });

    wx.loadFontFace({
      global: true,
      family: 'Pingfang SC',
      source: 'url("https://madestsamurai.github.io/Pingfang_Extralight.woff")',
      desc: {
        weight: 100
      },
    });

    wx.loadFontFace({
      global: true,
      family: 'Pingfang SC',
      source: 'url("https://madestsamurai.github.io/Pingfang_Medium.woff")',
      desc: {
        weight: 400
      },
    });
  },

  editTabBar: function () {
    var _curPageArr = getCurrentPages();
    var _curPage = _curPageArr[_curPageArr.length - 1];
    var _pagePath = _curPage.__route__;

    if (_pagePath.indexOf('/') != 0) {
      _pagePath = '/' + _pagePath;
    }

    var tabBar = this.globalData.tabBar;
    for (var i = 0; i < tabBar.list.length; i++) {
      tabBar.list[i].active = false;
      if (tabBar.list[i].pagePath == _pagePath) {
        tabBar.list[i].active = true;
      }
    }

    _curPage.setData({
      tabBar: tabBar
    });
  },

  globalData: {
    userInfo: null,
    tabBar: {
      list: [{
        selectedIconPath: "/image/tabbar/now-hl.svg",
        iconPath: "/image/tabbar/now.svg",
        pagePath: "/pages/now/now",
        text: "现在就听",
        class: "menu-item",
        selected: false,
      }, {
        selectedIconPath: "/image/tabbar/explore-hl.svg",
        iconPath: "/image/tabbar/explore.svg",
        pagePath: "/pages/explore/explore",
        text: "浏览",
        class: "menu-item",
        selected: false,
      }, {
        selectedIconPath: "/image/tabbar/broadcast-hl.svg",
        iconPath: "/image/tabbar/broadcast.svg",
        pagePath: "/pages/broadcast/broadcast",
        text: "广播",
        class: "menu-item",
        selected: false,
      }, {
        selectedIconPath: "/image/tabbar/resource-hl.svg",
        iconPath: "/image/tabbar/resource.svg",
        pagePath: "/pages/storage/storage",
        text: "资料库",
        class: "menu-item",
        selected: false,
      }, {
        selectedIconPath: "/image/tabbar/search-hl.svg",
        iconPath: "/image/tabbar/search.svg",
        pagePath: "/pages/search/search",
        text: "搜索",
        class: "menu-item",
        selected: false,
      }],
      position: "bottom"
    },
    isPlayGlobal: false,
    musicIdGlobal: ''
  }
})