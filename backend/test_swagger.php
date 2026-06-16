<?php
require __DIR__.'/vendor/autoload.php';

try {
    $generator = new \OpenApi\Generator();
    $openapi = $generator->generate([
        __DIR__.'/app/Http/Controllers/Api/V1/AgentController.php', 
        __DIR__.'/app/Swagger.php'
    ]);
    echo "OK: AgentController.php\n";
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
