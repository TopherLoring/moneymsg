import glob

def patch_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    if 'try {' not in content and 'sweep' in content:
        pass

for file in glob.glob('src/jobs/*.ts'):
    with open(file, 'r') as f:
        content = f.read()

    if '.catch(console.error)' not in content:
        if 'sweepExpiredIntents()' in content:
             content = content.replace('sweepExpiredIntents();', 'sweepExpiredIntents().catch(console.error);')
             content = content.replace('setInterval(sweepExpiredIntents, SWEEP_INTERVAL_MS);', 'setInterval(() => sweepExpiredIntents().catch(console.error), SWEEP_INTERVAL_MS);')
        if 'sweepStaleWebhookEvents()' in content:
             content = content.replace('sweepStaleWebhookEvents();', 'sweepStaleWebhookEvents().catch(console.error);')
             content = content.replace('setInterval(sweepStaleWebhookEvents, SWEEP_INTERVAL_MS);', 'setInterval(() => sweepStaleWebhookEvents().catch(console.error), SWEEP_INTERVAL_MS);')
        if 'sweepExpiredRequests()' in content:
             content = content.replace('sweepExpiredRequests();', 'sweepExpiredRequests().catch(console.error);')
             content = content.replace('setInterval(sweepExpiredRequests, SWEEP_INTERVAL_MS);', 'setInterval(() => sweepExpiredRequests().catch(console.error), SWEEP_INTERVAL_MS);')

        with open(file, 'w') as f:
             f.write(content)
