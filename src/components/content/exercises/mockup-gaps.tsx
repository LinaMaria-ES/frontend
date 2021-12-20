import { faSave } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import nProgress from 'nprogress'
import { useState } from 'react'

import { showToastNotice } from '@/helper/show-toast-notice'
import { GapEx, Gappy } from '@/pages/___gaps'

export function MockupGaps() {
  const [showWalletNotice, setShowWalletNotice] = useState(false)
  const [success, setSuccess] = useState(false)

  function onFeedbackHandler(success: boolean) {
    setShowWalletNotice(true)
    setSuccess(success)
  }

  function onSave() {
    nProgress.start()
    setTimeout(() => {
      nProgress.done()
      showToastNotice('👌 Erfolgreich in deiner Wallet gespeichert', 'success')
    }, 540)
  }

  /*
  Brüche lassen sich nur addieren, wenn sie den gleichen [Nenner] besitzen. Man addiert sie, indem man die Zähler [addiert]. Die Nenner werden [nicht verändert].
  Wenn Brüche nicht [gleichnamig] sind, müssen diese erst [erweitert] werden auf [ein gemeinsames Vielfaches] der Nenner. Danach erst lassen sich die Brüche addieren.
  [\Zähler] [\kürzen] [\gleichzählig] [\einen gemeinsamen Teiler]
  */

  return (
    <>
      <GapEx
        choices={[
          'Nenner',
          'addiert',
          'nicht verändert',
          'gleichnamig',
          'erweitert',
          'ein gemeinsames Vielfaches',
          'Zähler',
          'kürzen',
          'gleichzählig',
          'einen gemeinsamen Teiler',
        ]}
        count={6}
        onFeedback={onFeedbackHandler}
      >
        <p className="serlo-p mb-block leading-relaxed">
          Brüche lassen sich nur addieren, wenn sie den gleichen{' '}
          <Gappy index={0} /> besitzen. Man addiert sie, indem man die Zähler{' '}
          <Gappy index={1} />. Die Nenner werden <Gappy index={2} />. Wenn
          Brüche nicht <Gappy index={3} /> sind, müssen diese erst{' '}
          <Gappy index={4} /> werden auf <Gappy index={5} /> der Nenner. Danach
          erst lassen sich die Brüche addieren.
        </p>
      </GapEx>
      {showWalletNotice ? (
        <div className="bg-brand-100 mx-side p-side my-20 text-center rounded-xl">
          {success
            ? 'Super, du hast den Kurs erfolgreich durchgearbeitet! '
            : 'Yeah, du hast den Kurs durchgearbeitet. '}
          <>
            Du kannst deinen Lernfortschritt jetzt speichern.
            <br />
            {!success && 'Oder du probierst dich noch mal an der Übung'}
            <br />
            <button
              className="serlo-button serlo-make-interactive-green mt-2 m-auto text-center"
              onClick={onSave}
            >
              <FontAwesomeIcon icon={faSave} /> In deiner Wallet speichern
            </button>
          </>
        </div>
      ) : null}
    </>
  )
}
