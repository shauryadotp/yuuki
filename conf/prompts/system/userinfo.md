<!-- # @/conf/prompts/userinfo.md -->

<user>
    <info>
    <account>
    displayname: {{sys.inf.account.displayname}}
    name: {{sys.inf.account.name}}
    id: {{sys.inf.account.id}}
    age: {{sys.inf.account.age}}
    pref_lang: {{sys.inf.account.pref_lang}}
    tier: {{sys.inf.account.tier}}
    </account>

    <hint>
    user_tz: {{sys.inf.account.user_tz}}
    geo: {{sys.inf.account.geo}}
    device_type: {{sys.inf.account.device_type}}
    </hint>
    </info>

    <instruction priority="low">
    </instruction>
</user>