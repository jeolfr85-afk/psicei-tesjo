<?php
require_once __DIR__ . '/includes/portal_layout.php';

$session = portalRequireSession();
$usuario = $session['usuario'];
$area = $session['area'];
$role = $session['role'];

portalLayoutHead($role === 'admin' ? 'Menú principal del sistema' : 'Mis módulos');
portalLayoutBodyOpen(
    $session,
    $role === 'admin' ? 'Menú principal del sistema' : 'Mis módulos',
    'Navegación central a departamentos y consultas del portal PSICEI.',
    'Portal'
);

$title = $role === 'admin' ? 'Menú principal del sistema' : 'Mis módulos';
$lead = $role === 'admin'
    ? 'Navega por direcciones y departamentos desde el menú lateral. Selecciona un módulo para comenzar a capturar información.'
    : 'Usa el menú lateral para acceder a los departamentos y subáreas de tu área. El asistente IA está disponible en la esquina inferior derecha.';
?>
        <header class="portal-main-header">
            <h1><?php echo htmlspecialchars($title); ?></h1>
            <p class="portal-lead"><?php echo htmlspecialchars($lead); ?></p>
            <?php if ($area !== ''): ?>
                <span class="portal-area-badge">Área: <?php echo htmlspecialchars($area); ?></span>
            <?php endif; ?>
        </header>

        <div class="portal-cards">
            <article class="portal-card">
                <h3>Guía del sistema</h3>
                <p>
                    Captura reportes e indicadores en las tabletas de cada módulo, guarda tus registros
                    y descárgalos en PDF o Excel. Pregunta al asistente si necesitas ayuda paso a paso.
                </p>
            </article>
            <article class="portal-card">
                <h3>Consultas rápidas</h3>
                <p>Revisa tu historial de registros o el directorio de contactos desde el apartado Consultas en el menú lateral.</p>
            </article>
            <?php if ($role === 'admin'): ?>
            <article class="portal-card">
                <h3>Administración</h3>
                <p>Gestiona usuarios y configuración desde el Panel administrador en el menú lateral.</p>
            </article>
            <?php endif; ?>
        </div>

        <?php
        $ssrp = getServicioSocialResidenciaNav();
        if ($role !== 'admin' && (str_contains(mb_strtolower($area), 'vinculación') || str_contains(mb_strtolower($area), 'vinculacion'))):
        ?>
        <section class="portal-card" style="margin-top:8px;animation-delay:.08s">
            <h3><?php echo htmlspecialchars($ssrp['label']); ?></h3>
            <p style="margin-bottom:14px;color:#64748b;font-size:.92rem">Accede a las subáreas del departamento:</p>
            <div class="portal-module-grid">
                <?php foreach ($ssrp['children'] as $child): ?>
                <a class="portal-module-link" href="<?php echo htmlspecialchars((string)$child['url']); ?>">
                    <?php echo portalNavIconSvg((string)($child['icon'] ?? 'module')); ?>
                    <span><?php echo htmlspecialchars((string)$child['label']); ?></span>
                </a>
                <?php endforeach; ?>
            </div>
            <p style="margin-top:14px">
                <a class="portal-module-link" href="<?php echo htmlspecialchars((string)$ssrp['url']); ?>" style="max-width:320px">
                    <?php echo portalNavIconSvg('dept'); ?>
                    <span>Ver departamento completo</span>
                </a>
            </p>
        </section>
        <?php endif; ?>

<?php portalLayoutBodyClose(); ?>
