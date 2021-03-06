
import './styles/Viewing.Extension.Particle.css'
import GUIObjectAdapter from 'GUIObjectAdapter'
import ToolPanelBase from 'ToolPanelBase'
import dat from 'dat-gui'

export default class ParticlePanel extends ToolPanelBase {

  /////////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////////
  constructor (particleTool, viewer, btnElement) {
    
    super(viewer.container, 'Particle Controls', {
      buttonElement: btnElement,
      closable: false
    })

    this._particleTool = particleTool

    this._viewer = viewer

    $(this.container).addClass('particle')

    var gui = new dat.GUI({
      autoPlace: false
    })

    var guiContainer = document.getElementById(
      this.container.id + '-gui')

    guiContainer.appendChild(
      gui.domElement)

    var folder = gui.addFolder('Particle System Settings')

    this.particleSytemGUI = new GUIObjectAdapter(
      particleTool.particleSystem, {
        maxParticles: {
          getter: 'getMaxParticles',
          setter: 'setMaxParticles'
        }
    })

    this.maxParticleCtrl = folder.add(
      this.particleSytemGUI,
      'maxParticles', 0, 50000).name(
        'Max Particles').step(1)

    this.maxParticleCtrl.onFinishChange((value) => {

      this.particleSytemGUI.update()

      this.emit('maxParticles.changed', value)
    })

    this.particleSytemGUI.shaders = 'ON'

    this.shadersCtrl = folder.add(
      this.particleSytemGUI,
      'shaders', ['ON', 'OFF']).name(
      'Shaders')

    this.shadersCtrl.onFinishChange((value) => {

      this.emit('shaders.changed', value)
    })

    folder.open()

    setTimeout(() => {
      gui.domElement.style.width = '100%'
    }, 0)
  }
  
  /////////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////////
  htmlContent (id) {
    
    return `
     <div class="container">
          <div id="${id}-gui">
          </div>
      </div>`
  }

  /////////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////////
  loadObjectGUI (obj) {

    $('#' + this.container.id + '-obj-gui').remove()

    if (!obj || !obj.getSelectable()) {
      return
    }

    var gui = new dat.GUI({
      autoPlace: false
    })

    $('#' + this.container.id + '-gui').append(
      `<div id="${this.container.id}-obj-gui"></div>`
    )

    var guiContainer = document.getElementById(
      this.container.id + '-obj-gui')

    guiContainer.appendChild(
      gui.domElement)

    switch (obj.getType()) {

      case 0:

        this.selectedObjectGUI = new GUIObjectAdapter(
          this._particleTool.particleSystem.getEmitter(obj.getId()), {
            emissionRate: {
              getter: 'getEmissionRate',
              setter: 'setEmissionRate'
            },
            spread: {
              getter: 'getSpread',
              setter: 'setSpread'
            },
            velocity: {
              getter: 'getVelocity',
              setter: 'setVelocity'
            },
            charge: {
              getter: 'getCharge',
              setter: 'setCharge'
            }
          })

        var emitterFolder = gui.addFolder(
          'Emitter Settings')

        emitterFolder.add(
          this.selectedObjectGUI,
          'emissionRate', 10, 2000).name('Emission Rate').
          onChange(() => {
            this.selectedObjectGUI.update()
          })

        emitterFolder.add(
          this.selectedObjectGUI,
          'spread', 0.0, 6 * Math.PI / 180).name('Spread').
          onChange(() => {
            this.selectedObjectGUI.update()
          })

        emitterFolder.add(
          this.selectedObjectGUI,
          'velocity', 0.1, 10).name('Particles Velocity').
          onChange(() => {
            this.selectedObjectGUI.update()
          })

        var chargeCtrl = emitterFolder.add(
          this.selectedObjectGUI,
          'charge', -10, 10).name('Particles Charge')

        chargeCtrl.onChange((value) => {

          this.selectedObjectGUI.update()

          this.emit('objectModified', {
            property: 'charge',
            value: value,
            object: obj
          })
        })

        emitterFolder.open()
        break

      case 1:

        this.selectedObjectGUI = new GUIObjectAdapter(
          this._particleTool.particleSystem.getMagneticField(obj.getId()), {
            force: {
              getter: 'getForce',
              setter: 'setForce'
            }
          })

        var fieldFolder = gui.addFolder('Field Settings')

        var forceCtrl = fieldFolder.add(
          this.selectedObjectGUI,
          'force', -100, 100).name('Force')

        forceCtrl.onChange((value) => {

          this.selectedObjectGUI.update()

          this.emit('objectModified', {
            property: 'force',
            value: value,
            object: obj
          })
        })

        fieldFolder.open()
        break

      default:
        break
    }

    window.setTimeout(() => {
      gui.domElement.style.width = '100%'
    }, 0)

    this.setVisible(true)
  }

  /////////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////////
  setSelected (obj) {

    this.loadObjectGUI(obj)
  }
}