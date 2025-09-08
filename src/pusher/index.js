import Echo from 'laravel-echo'

window.io = require('socket.io-client')

const pusher = {
  echo: null,
  companyChannel: null,
  userChannel: null,

  init(token = null, connectCallback) {
    if (token && token?.headers?.Authorization) {
      console.log('token', token)
      if ( ! this.echo) {
        const port = 6001
        this.echo = new Echo({
          broadcaster: "socket.io",
          host: `${window.location.hostname}`+ (process.env.MIX_APP_ENV === 'local' ? `:${port}` : ''),
          auth: {
            params: {
              token: token.headers.Authorization.split(' ')[1] || token.headers.Authorization,
            },
            headers: {
              Authorization: token.headers.Authorization,
            },
          }
        })

        //this.log(this.echo, 'Echo init')

        this.echo.connector.socket.on('connect', () => {
          //this.log(this.echo.socketId(), 'Connected Event')
          connectCallback({
            type: 'connected',
          })
        })

        this.echo.connector.socket.on('disconnect', () => {
          //this.log('Disconnected Event')
          connectCallback({
            type: 'disconnected',
          })
        })

        this.echo.connector.socket.on('reconnecting', (attempts) => {
          //this.log(attempts, 'Reconnecting Event')
          connectCallback({
            type: 'reconnected',
            attempts,
          })
        })

        return this.echo
      } else {
        //this.log('Echo already inited')
      }
    } else {
      //this.log('Token in null during Echo init')
    }

    return false
  },

  openCompanyChannel(companyId) {
    this.closeCompanyChannel()

    if (this.echo) {
      this.companyChannel = this.echo.join(`company.${companyId}`)
      //this.log(this.companyChannel, 'Company Channel was open')
      return this.companyChannel
    } else {
      //this.log('Echo is undefined during Open Company Channel')
    }

    return false
  },

  listenCompanyChange(callback) {
    if (this.companyChannel) {
      this.companyChannel.listen('Api.CompanyChange', (e) => {
        //this.log(e, 'Listen Company Change Event')

        callback(e)
      })

      const event = this.companyChannel.events[(this.companyChannel.eventFormatter.namespace + '.Api.CompanyChange').replace(/\./gi, '\\')]
      if (event) {
        //this.log(event, 'Subscribe to Company Change Event')
        return event
      }

      //this.log('Faild Subscribe to Company Change Event')
    } else {
      //this.log('Company Channel is undefined during listen Company Change Event')
    }

    return false
  },

  listenCompanyNotify(callback) {
    if (this.companyChannel) {
      this.companyChannel.listen('Api.CompanyNotify', (e) => {
        //this.log(e, 'Listen Company Notify Event')

        callback(e)
      })

      const event = this.companyChannel.events[(this.companyChannel.eventFormatter.namespace + '.Api.CompanyNotify').replace(/\./gi, '\\')]
      if (event) {
        //this.log(event, 'Subscribe to Company Notify Event')
        return event
      }

      //this.log('Faild Subscribe to Company Notify Event')
    } else {
      //this.log('Company Channel is undefined during listen Company Notify Event')
    }

    return false
  },

  listenModuleExportNotify(callback) {
    if (this.companyChannel) {
      this.companyChannel.listen('Api.ModuleExportNotify', (e) => {
        callback(e)
      })

      const event = this.companyChannel.events[(this.companyChannel.eventFormatter.namespace + '.Api.ModuleExportNotify').replace(/\./gi, '\\')]
      if (event) {
        return event
      }

    } else {

    }

    return false
  },

  closeCompanyChannel() {
    if (this.echo) {
      if (this.companyChannel) {
        this.echo.leave(this.companyChannel.name)
        this.companyChannel = null

        //this.log('Company Channel was closed')
        return true
      } else {
        //this.log('Company Channel is undefined during Close Company Channel')
      }
    } else {
      //this.log('Echo is undefined during Close Company Channel')
    }

    return false
  },



  //User channel

  openUserChannel(userId) {
    this.closeUserChannel()
    if (this.echo) {
      this.userChannel = this.echo.join(`App.Models.User.${userId}`)
      //console.log(this.userChannel, 'User Channel was open')
      return this.userChannel
    } else {
      //console.log('Echo is undefined during Open User Channel')
    }

    return false
  },

  listenUserNotify(callback) {
    if (this.userChannel) {
      this.userChannel.listen('.App\\Events\\UserNotify', (e) => {
        //this.log(e, 'Listen User Notify Event')
        callback(e)
      })

      const event = this.userChannel.events['App\\Events\\UserNotify'];
      if (event) {
        //this.log(event, 'Subscribe to User Notify Event')
        return event
      }

      //this.log('Failed Subscribe to User Notify Event')
    } else {
      //this.log('User Channel is undefined during listen User Notify Event')
    }

    return false
  },

  closeUserChannel() {
    if (this.echo) {
      if (this.userChannel) {
        this.echo.leave(this.userChannel.name)
        this.userChannel = null

        //this.log('User Channel was closed')
        return true
      } else {
        //this.log('User Channel is undefined during Close User Channel')
      }
    } else {
      //this.log('Echo is undefined during Close User Channel')
    }

    return false
  },


  log(data, title = false) {
    if (process.env.MIX_APP_ENV === 'local' || process.env.MIX_APP_ENV === 'development') {
      if (title) {
        console.log(title, data)
      } else {
        console.log(data)
      }
    }
  },
}

export default pusher