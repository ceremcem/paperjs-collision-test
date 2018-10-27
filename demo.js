var x = new Path.Line({
    from: [100, 100],
    to: [200, 100],
    strokeColor: 'red',
    strokeWidth: 20,
    // strokeCap option: 
    // ----------------------------
    // whether set to 'round' or not, hitTest() 
    // behaves as if it is set to 'round'
    strokeCap: 'round' 
})
x.addSegment([300,300])
    
var dot = new Path.Circle({
    center: [400, 300],
    radius: 25,
    fillColor: 'orange',
    data: {
        type: 'pointer'
    }
})

var clearance = new Path.Circle({
    center: dot.bounds.center,
    radius: 45,
    fillColor: "black",
    opacity: 0.2,
    data: {
        type: 'pointer'
    }
})
clearance.moveBelow(dot)

var alert = new Path.Rectangle({
    from: [400, 50],
    to: [450, 100],
    fillColor: 'green',
    radius: 10,
    selected: true
})

// Returns item.position at the moment of collision
// and the collided object.
function collisionTest(item, curr){
    var prev = item.position;
    var point = curr.clone();
    var hit = null;
    var tolerance = 45;
    var _error = 0.01;
    var firstPass = true;
    var _stopSearching = false;
    var _step = ((curr - prev) / 2).clone();
    var _acceptable_iter_count = 16;
    var _max_iter_count = 100;

    var i; 
    for (i = 0; i < _max_iter_count; i++){
        var _hit = project.hitTest(point, {
            fill: true, 
            stroke: true, 
            segments: true, 
            tolerance: tolerance,
            match: function(hit){
                if (hit.item && hit.item.data && hit.item.data.type === "pointer"){
                    return false
                }
                return true
            }
        })
    
        if(_hit){
            hit = _hit;
            // hit has happened between prev and curr points 
            // step half way backward
            point -= _step 
            if (_step.length < _error){
                // step is too small, stop trials as soon 
                // as no hit can be found
                _stopSearching = true;
            }
        } else {
            if(firstPass || _stopSearching){
                break;
            } else  {
                // not hit found, but we should 
                // step forward to search for a more 
                // accurate collision point 
                point += _step  
            }
        }
        firstPass = false;
        if(_step.length >= _error * 2 ) {
            _step /= 2
        } else {
            // minimum step length must be error/2
            // in order to save loop count 
            _step = _step.normalize(_error * 0.8)
        }
    }
    if (i > _acceptable_iter_count){
        console.log("found at " + i + ". iteration, step: ", _step.length)
    }
    return {point, hit}
}

function onMouseMove(event){
    var coll = collisionTest(clearance, event.point)
    dot.position = coll.point 
    clearance.position = coll.point

    if(coll.hit){
        alert.fillColor = 'red'
        coll.hit.item.strokeColor = 'yellow'
    } else {
        alert.fillColor = 'green'
    }
    
}
