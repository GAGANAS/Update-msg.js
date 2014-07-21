cleanASCII = function(a) {
    var b = a.split('&#');
    for (var c = 1; c < b.length; c++) {
        var d = b[c].split(';')[0];
        a = a.replace('&#' + d + ';', String.fromCharCode(d));
    }
    a = a.split('&lt;').join('<').split('&gt;').join('>').split('&amp;').join('&').split('&quot;').join('"');
    return a;
};
String.prototype.equalsIgnoreCase = function(other) {
    return typeof other !== 'string' ? false : this.toLowerCase() === other.toLowerCase();
};
if (deleter) {
    deleter.close();
}
var deleter = {
    data: {
        gray: false,
        rdj: false,
        bou: false,
        man: false,
        coh: false,
        hos: false,
        all: false,
        users: [],
        version: '1.1.1',
        meh: false
    },
    init: function() {
        this.list('Chat deleter version ' + this.data.version + ' by Thedark1337 loaded. Type /list for commands', true);
        this.proxy = {
            onChat: $.proxy(this.onChat, this),
            onCommand: $.proxy(this.onCommand, this),
            onVote: $.proxy(this.onVoteUpdate, this)
        };
        API.on(API.CHAT, this.proxy.onChat);
        API.on(API.CHAT_COMMAND, this.proxy.onCommand);
        API.on(API.VOTE_UPDATE, this.proxy.onVote);
        $('#chat-messages').on('click', '.timestamp', function() {
                    if ($(this).parent().find('.delete-button span').length === 0) {
                        var id = $(this).parent().attr('class').split(' ');
                            ((id.length === 2) ? id = id[1].substr(4) : id = id[2].substr(4));
                        return API.moderateDeleteChat(id);
                    } else return false;
                });
    },
    close: function() {
        this.list('Chat Deleter version ' + this.data.version + ' disabled.', true);
        API.off(API.CHAT, this.proxy.onChat);
        API.off(API.CHAT_COMMAND, this.proxy.onCommand);
        API.off(API.VOTE_UPDATE, this.proxy.onVote);
        $('#chat-messages').off('click', '.timestamp');
    },
    onChat: function(data) {
        if (!data || !data.fromID) return;
        var id = data.chatID,
            a = data.type,
            b = data.fromID,
            permission = API.getUser(b).permission,
            c = data.message.toLowerCase(),
            d = data.from,
            ns = d.length,
            msg = cleanASCII(data.message),
            match = API.getUser().id !== b,
            log = function() {
                return console.log.apply(console, ['[' + deleter.getTimeStamp() + ']'].concat($.makeArray(arguments)));
            };
        (a === 'emote') ? log('(' + b + ') ' + d + ' ' + Array(25 - ns).join(' ') + ':/me ' + msg) : log('(' + b + ') ' + d + ' ' + Array(25 - ns).join(' ') + ': ' + msg);
        switch (permission) {
            case 0:
                if (this.data.gray && match) API.moderateDeleteChat(id);
                break;
            case 1:
                if (this.data.rdj && match) API.moderateDeleteChat(id);
                break;
            case 2:
                if (this.data.bou && match) API.moderateDeleteChat(id);
                break;
            case 3:
                if (this.data.man && match) API.moderateDeleteChat(id);
                break;
            case 4:
                if (this.data.coh && match) API.moderateDeleteChat(id);
                break;
            case 5:
                if (this.data.hos && match) API.moderateDeleteChat(id);
                break;
        }
        if (c.indexOf('!stopall') === 0 && API.hasPermission(b, 3)) {
            this.data.gray = false, this.data.rdj = false, this.data.bou = false, this.data.man = false, this.data.coh = false, this.data.hos = false, this.data.all = false;
            API.moderateDeleteChat(id);
            this.list('Stopped Deleting All Chat');
        }
        if (this.data.all && match) API.moderateDeleteChat(id);
        if (~$.inArray(b, this.data.users)) API.moderateDeleteChat(id);
    },
    getTimeStamp: function() {
        var date = new Date(),
            hours = date.getHours(),
            minutes = date.getMinutes(),
            seconds = date.getSeconds(),
            period = ' AM';
        if (hours >= 12) {
            var h = hours;
            hours = h - 12;
            period = ' PM';
        }
        if (hours === 0) hours = 12;
        (minutes < 10) ? minutes = '0' + minutes : minutes;
        (seconds < 10) ? seconds = '0' + seconds : seconds;
        return hours + ':' + minutes + ':' + seconds + period;
    },
    getUser: function(data) {
        var users = API.getUsers();
        if (users.length > 1) {
            data = data.trim();
            if (data.substr(0, 1) === '@') data = data.substr(1);
            for (var i in users) {
                if (users[i].username.equalsIgnoreCase(data) || users[i].id.equalsIgnoreCase(data))
                    return users[i];
            }
            return null;
        }
    },
    list: function(text) {
        var a = $('#chat-messages'),
            b = a.scrollTop() > a[0].scrollHeight - a.height() - 20;
        a.append('<div class="update"><span class="text" style="color:#0095FF"> ' + '[' + this.getTimeStamp() + ']' + '</br>' + text + ' </span></div>');
        b && a.scrollTop(a[0].scrollHeight);
    },
    onCommand: function(value) {
        if (!value) return;
        var commands = '/gray - Delete All Gray Chat </br> /rdj - Delete All RDJ Chat </br> /bouncer - Delete All Bouncer Chat </br> /manager - Delete all Manager Chat </br> /cohost - Delete All Co-Host Chat </br> /all - Delete ALL chat (excluding your own) </br> /ids - get all user IDs & usernames and prints to console and chat </br>  /getid @user OR /getid user Get user id and username of user and prints to console and chat </br> /del @user OR /del user will delete all chat from that user. </br> /wipe  {@user} if user not mentioned delete all previous chat from all users.  Else delete all chat of mentioned person</br> /log  Toggle Meh Logger On and Off </br>NOTE: to turn off commands for chat delete type the same command again';
        switch (value) {
            case '/gray':
                this.data.gray = !this.data.gray;
                this.list((this.data.gray ? 'deleting' : 'no longer deleting') + ' gray chat');
                break;
            case '/rdj':
                this.data.rdj = !this.data.rdj;
                this.list((this.data.rdj ? 'deleting' : 'no longer deleting') + ' rdj chat');
                break;
            case '/bouncer':
                this.data.bou = !this.data.bou;
                this.list((this.data.bou ? 'deleting' : 'no longer deleting') + ' bouncer chat');
                break;
            case '/manager':
                this.data.man = !this.data.man;
                this.list((this.data.man ? 'deleting' : 'no longer deleting') + ' manager chat');
                break;
            case '/cohost':
                this.data.coh = !this.data.coh;
                this.list((this.data.coh ? 'deleting' : 'no longer deleting') + ' cohost chat');
                break;
            case '/host':
                this.data.hos = !this.data.hos;
                this.list((this.data.hos ? 'deleting' : 'no longer deleting') + ' host chat');
                break;
            case '/all':
                this.data.all = !this.data.all;
                this.list((this.data.all ? 'deleting' : 'no longer deleting') + ' all chat');
                break;
            case '/ids':
                var id = [],
                    users = API.getUsers();
                for (var i in users) id.push('username: ' + users[i].username + ' ID: ' + users[i].id + '\n');
                console.log('' + id);
                this.list('' + id);
                break;
            case '/list':
                this.list(commands);
                break;
            case '/log':
                this.data.meh = !this.data.meh;
                this.list('Meh Logger is now: ' + (this.data.meh ? ' Active.' : 'Inactive.'));
                break;
        }
        if (~value.indexOf('/getid')) {
            var user = this.getUser(value.substr(6));
            if (user === null) {
                this.list('Invalid Syntax');
                return;
            }
            var username = cleanASCII(user.username),
                id = user.id;
            this.list('username: ' + username + ' ID: ' + id);
            console.log('username: ' + username + ' ID: ' + id);
        }
        if (~value.indexOf('/wipe')) {
            var arg = $('#chat-messages').children(),
                user = this.getUser(value.substr(6));
            if (user === null) {
                for (var i in arg) {
                    var id = arg[i].className;
                    if (id) var cid = id.substr(id.indexOf('cid-') + 4, 14);
                    if (id && id !== 'update' && id !== 'welcome') {
                        API.moderateDeleteChat(cid);
                    }
                }
            } else if (user !== null && user.id) {
                var user = user.id.substr(0, 6);
                for (var i in arg) {
                    var chat = arg[i].className;
                    if (chat) var cid = chat.substr(chat.indexOf('cid-') + 4, 14);
                    if (chat && chat !== 'update' && chat !== 'welcome' && ~cid.indexOf(user)) {
                        API.moderateDeleteChat(cid);
                    }
                }
            }
        }
        if (~value.indexOf('/del')) {
            var user = this.getUser(value.substr(5));
            if (user === null) {
                this.list('Invalid Syntax');
                return;
            }
            var id = user.id,
                username = user.username;
            if (~$.inArray(id, this.data.users)) {
                this.data.users.splice(this.data.users.indexOf(id), 1);
                this.list('No longer deleting All chat from user: ' + username);
            } else {
                this.data.users.push(id);
                this.list('Deleting All chat from user: ' + username);
            }
        }
    },
    onVoteUpdate: function(obj) {
        if (!obj || !obj.vote) return;
        if (obj.vote === -1 && this.data.meh) {
            console.log('[' + this.getTimeStamp() + ']' + 'Meh Detected: ID ' + obj.user.id + ' Username ' + obj.user.username);
            this.list('Meh Detected: ID ' + obj.user.id + ' Username ' + obj.user.username);
        }
    }
};
if (API.hasPermission(API.getUser().id, 2)) {
    deleter.init();
}
