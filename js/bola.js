class Bola 
{
    constructor(puntPosicio, radi) {
        this.radi = radi;
        this.posicio = puntPosicio;
        this.vx = 1;
        this.vy = -1;
        this.color = "#fff";
      
    };

    draw(ctx) {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.posicio.x, this.posicio.y, this.radi, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }
    mou(x,y){
        this.posicio.x += x;
        this.posicio.y += y;
    }
    update(canvas, pala, totxo)
    {

        let puntActual = this.posicio;
        let puntSeguent= new Punt(this.posicio.x + this.vx,
                            this.posicio.y + this.vy);
        let trajectoria= new Segment(puntActual, puntSeguent);
        let exces;
        let xoc = false;
        

        //Xoc amb els laterals del canvas
        // Rebote Techo
        if (trajectoria.puntB.y - this.radi < 0) {
        exces = (trajectoria.puntB.y - this.radi) / this.vy;
        this.posicio.x = trajectoria.puntB.x - exces * this.vx;
        this.posicio.y = this.radi;
        this.vy = -this.vy;
        xoc = true;
        }
        // Rebote Pared Derecha
        else if (trajectoria.puntB.x + this.radi > canvas.width) {
        exces = (trajectoria.puntB.x + this.radi - canvas.width) / this.vx;
        this.posicio.y = trajectoria.puntB.y - exces * this.vy;
        this.posicio.x = canvas.width - this.radi;
        this.vx = -this.vx;
        xoc = true;
        }
        
        // Rebote Pared Izquierda
        else if (trajectoria.puntB.x - this.radi < 0) {
        exces = (trajectoria.puntB.x - this.radi) / this.vx;
        this.posicio.y = trajectoria.puntB.y - exces * this.vy;
        this.posicio.x = this.radi;
        this.vx = -this.vx;
        xoc = true;
        }
    
        //Xoc lateral inferior
        //en teoria si choca con la parte de abajo del canvas , lo q esta por debajo de la pala, pues se pierde
      
        //Xoc amb la pala

        //Xoc amb els totxos del mur
        //Utilitzem el mètode INTERSECCIOSEGMENTRECTANGLE

        let colisio = this.interseccioSegmentRectangle(trajectoria, pala) || this.interseccioSegmentRectangle(trajectoria, totxo);

        if (colisio) 
            {
                this.posicio = colisio.pI;
    
                if (colisio.voraI === "superior" || colisio.voraI === "inferior") 
                {
                    this.vy = -this.vy;
                } 
                else 
                {
                    this.vx = -this.vx;
                }
                xoc = true;
            }
        

        if (!xoc){
            this.posicio.x = trajectoria.puntB.x;
            this.posicio.y = trajectoria.puntB.y;
        }     
        
    }

    interseccioSegmentRectangle(segment, rectangle){
       let puntI;
       let distanciaI;
       let puntIMin;
       let distanciaIMin = Infinity;
       let voraI;

       //1r calcular punt d'intersecció amb les 4 vores del rectangle
       //necessitem coneixer els 4 segments del rectangle
       
       //vora superior (esta ya venía de fábrica)
       let segmentVoraSuperior = new Segment(rectangle.posicio,
           new Punt(rectangle.posicio.x + rectangle.amplada, rectangle.posicio.y));
       
       //vora inferior (completada)
       let segmentVoraInferior = new Segment(new Punt(rectangle.posicio.x, rectangle.posicio.y + rectangle.alcada),
           new Punt(rectangle.posicio.x + rectangle.amplada, rectangle.posicio.y + rectangle.alcada));
      
       //vora esquerra (completada)
       let segmentVoraEsquerra = new Segment(rectangle.posicio,
           new Punt(rectangle.posicio.x, rectangle.posicio.y + rectangle.alcada));
      
       //vora dreta (completada)
       let segmentVoraDreta = new Segment(new Punt(rectangle.posicio.x + rectangle.amplada, rectangle.posicio.y),
           new Punt(rectangle.posicio.x + rectangle.amplada, rectangle.posicio.y + rectangle.alcada));
      

       //2n REVISAR SI EXISTEIX UN PUNT D'INTERSECCIÓ EN UN DELS 4 SEGMENTS
       //SI EXISTEIX, QUIN ÉS AQUEST PUNT
       //si hi ha més d'un, el més ajustat
    
       //vora superior (esta ya venía de fábrica)
       puntI = segment.puntInterseccio(segmentVoraSuperior);
       if (puntI){
           //distancia entre dos punts, el punt inicial del segment i el punt d'intersecció
           distanciaI = Punt.distanciaDosPunts(segment.puntA,puntI);
           if (distanciaI < distanciaIMin){
               distanciaIMin = distanciaI;
               puntIMin = puntI;
               voraI = "superior";
           }
       }
       
       //vora inferior (completada siguiendo el mismo patrón)
       puntI = segment.puntInterseccio(segmentVoraInferior);
       if (puntI){
           distanciaI = Punt.distanciaDosPunts(segment.puntA,puntI);
           if (distanciaI < distanciaIMin){
               distanciaIMin = distanciaI;
               puntIMin = puntI;
               voraI = "inferior";
           }
       }
       
       //vora esquerra (completada siguiendo el mismo patrón)
       puntI = segment.puntInterseccio(segmentVoraEsquerra);
       if (puntI){
           distanciaI = Punt.distanciaDosPunts(segment.puntA,puntI);
           if (distanciaI < distanciaIMin){
               distanciaIMin = distanciaI;
               puntIMin = puntI;
               voraI = "esquerra";
           }
       }
      
       //vora dreta (completada siguiendo el mismo patrón)
       puntI = segment.puntInterseccio(segmentVoraDreta);
       if (puntI){
           distanciaI = Punt.distanciaDosPunts(segment.puntA,puntI);
           if (distanciaI < distanciaIMin){
               distanciaIMin = distanciaI;
               puntIMin = puntI;
               voraI = "dreta";
           }
       }
       
       //Retorna la vora i el punt si existeix col·lisió
       if (voraI){
           return {pI: puntIMin, vora: voraI};
       }
       return null;
    }

    distancia = function(p1,p2){
        return Math.sqrt((p2.x-p1.x)*(p2.x-p1.x)+(p2.y-p1.y)*(p2.y-p1.y));
    }
}

