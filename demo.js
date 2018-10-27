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

// returns item.position that makes the item only touch 
// to any object 
function collisionTest(item, curr){
    var prev = item.position;
    var point = curr.clone();
    var hit = null;
    var tolerance = 45;
    var _error = 0.01;
    var firstPass = true;
    var _stopSearching = false;
    var _step = ((curr - prev) / 2).clone();
    var _acceptable_iter_count = 20;
            

    var i; 
    for (i = 0; i < 100; i++){
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
            // step half way forward
            point.set(point - _step); 
            if (_step.length < _error){
                // step is too small, stop trials when 
                // no hit can be found
                _stopSearching = true;
            } else {
                _step.set(_step / 2)
            }
        } else {
            if(firstPass){
                break;
            } else {
                if (_stopSearching){
                    break;
                } else {
                    // not hit found, but we should 
                    // step forward to search for more 
                    // accurate collision point 
                    point.set(point + _step); 
                    _step.set(_step / 2)
                }
            }
        }
        firstPass = false;
    }
    if (i > _acceptable_iter_count){
        console.log("found at " + i + ". iteration, err: ", _step.length)
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
