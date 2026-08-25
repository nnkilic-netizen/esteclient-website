# -*- coding: utf-8 -*-
import re

with open(r'C:\Users\malik.kilic\Desktop\guzellik salonu - websitesi\components\beauty-crm-site.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Remove altPrice and altPeriod properties from all objects
text = re.sub(r"\s*altPrice:\s*['\"].*?['\"],", "", text)
text = re.sub(r"\s*altPeriod:\s*['\"].*?['\"],", "", text)

# Let's also check the JSX where altPrice is rendered and remove it, OR keep it so that if altPrice isn't there, it won't render.
# In the JSX: 
# {plan.altPrice && <p className="text-3xl font-semibold tracking-tight">₺{plan.altPrice}<span className={`text-xs font-normal ${plan.featured ? 'text-primary-foreground/75' : 'text-muted-foreground'}`}>{plan.altPeriod}</span></p>}
# This is safe to keep because plan.altPrice will be undefined and it won't render.

with open(r'C:\Users\malik.kilic\Desktop\guzellik salonu - websitesi\components\beauty-crm-site.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
