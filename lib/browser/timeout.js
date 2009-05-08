// setTimeout, setInterval, clearTimeout, clearInterval

// This implementation is single-threaded (like browsers) but requires a call to serviceTimeouts()
// Also includes beginning of a multithreaded implementation (commented out)

exports.setTimeout = function(callback, delay)
{
    return _scheduleTimeout(callback, delay, false);
}

exports.setInterval = function(callback, delay)
{
    return _scheduleTimeout(callback, delay, true);
}

exports.clearTimeout = function(id)
{
    if (_timeouts[id])
        _timeouts[id] = null;
}

exports.clearInterval = exports.clearTimeout;


var _nextId = 0,
    _timeouts = {},
    _pendingTimeouts = [];

var _scheduleTimeout = function(callback, delay, repeat)
{
    var date = new Date(new Date().getTime() + delay);

	if (typeof callback == "function")
		var func = callback;
	else if (typeof callback == "string")
		var func = new Function(callback);
	else
		return;

	var timeout = {
        callback: func,
    	date: date,
    	repeat: repeat,
    	interval: delay,
    	id : _nextId++
    }

    _timeouts[timeout.id] = timeout;
    _pendingTimeouts.push(timeout);

//	if (!_timersBlock)
//	    serviceTimeouts();

	return timeout.id;
}

//var _timersBlock = false,
//    _timerThread = null,
//    _nextTimeout = null;

exports.serviceTimeouts = function()
{
    while (_pendingTimeouts.length > 0)
    {
        _pendingTimeouts = _pendingTimeouts.sort(function (a,b) { return a.date - b.date; });
        
        var timeout = _pendingTimeouts.shift();
        if (_timeouts[timeout.id])
        {
        	var wait = timeout.date - new Date();

        	if (wait > 0)
        	{
        	    //if (_timersBlock)
        	    //{
        	        Packages.java.lang.Thread.sleep(wait);
        	    //}
        	    //else
        	    //{
        	    //    _pendingTimeouts.splice(0, 0, timeout);
        	    //    
        	    //    if (!_nextTimeout || _nextTimeout > timeout.date)
        	    //    {
                //        _nextTimeout = timeout.date;
                //        
            	//        
            	//        _timerThread = new java.lang.Thread(new java.lang.Runnable({
                //			run: function() {
                //    	        Packages.java.lang.Thread.sleep(wait);
                //    	        _nextTimeout = null;
                //			    serviceTimeouts();
                //			}
                //		}));
                //		
                //		_timerThread.start();
        	    //    }    
                //		
                //	return;
        	    //}
        	}

            // perform the callback
        	timeout.callback();
    	
    	    // if its an interval, reschedule it, otherwise clear it
        	if (timeout.repeat)
        	{
        	    var now = new Date(),
        	        proposed = new Date(timeout.date.getTime() + timeout.interval);
        	    timeout.date = (proposed < now) ? now : proposed;
        	    _pendingTimeouts.push(timeout);
        	}
        	else
                _timeouts[timeout.id] = null;
        }
    }
}
