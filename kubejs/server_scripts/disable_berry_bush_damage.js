let $DamageTypes = Java.loadClass("net.minecraft.world.damagesource.DamageTypes")

// Disable berry bush damage
NativeEvents.onEvent('net.neoforged.neoforge.event.entity.EntityInvulnerabilityCheckEvent', event => {
    if (event.source.is($DamageTypes.SWEET_BERRY_BUSH)) {
        event.setInvulnerable(true)
    }
})