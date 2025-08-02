import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Icon from "@/components/ui/icon";

interface Order {
  id: number;
  date: string;
  carBrand: string;
  carModel: string;
  services: string[];
  total: number;
  hasCommunityDiscount: boolean;
}

const Index = () => {
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [isCommunityDiscount, setIsCommunityDiscount] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [currentTab, setCurrentTab] = useState("home");
  const [carBrand, setCarBrand] = useState("");
  const [carModel, setCarModel] = useState("");
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 1,
      date: "2024-02-01",
      carBrand: "Toyota",
      carModel: "Camry",
      services: ["Замена масла", "Диагностика"],
      total: 2700,
      hasCommunityDiscount: true
    },
    {
      id: 2,
      date: "2024-02-02",
      carBrand: "BMW",
      carModel: "X5",
      services: ["Покраска элемента"],
      total: 3000,
      hasCommunityDiscount: false
    }
  ]);

  const categories = [
    {
      id: 1,
      name: "Техническое обслуживание",
      icon: "Wrench",
      services: [
        { id: 1, name: "Замена масла", price: 1500 },
        { id: 2, name: "Замена фильтров", price: 800 },
        { id: 3, name: "Диагностика", price: 1200 },
      ]
    },
    {
      id: 2,
      name: "Ремонт двигателя",
      icon: "Cog",
      services: [
        { id: 4, name: "Ремонт головки блока", price: 15000 },
        { id: 5, name: "Замена поршней", price: 25000 },
        { id: 6, name: "Капитальный ремонт", price: 50000 },
      ]
    },
    {
      id: 3,
      name: "Кузовной ремонт",
      icon: "Car",
      services: [
        { id: 7, name: "Покраска элемента", price: 3000 },
        { id: 8, name: "Рихтовка", price: 2500 },
        { id: 9, name: "Полировка", price: 1800 },
      ]
    },
    {
      id: 4,
      name: "Шиномонтаж",
      icon: "Circle",
      services: [
        { id: 10, name: "Монтаж/демонтаж", price: 400 },
        { id: 11, name: "Балансировка", price: 300 },
        { id: 12, name: "Ремонт камеры", price: 600 },
      ]
    }
  ];

  const allServices = categories.flatMap(cat => cat.services);
  const selectedServicesData = allServices.filter(service => selectedServices.includes(service.id));
  const subtotal = selectedServicesData.reduce((sum, service) => sum + service.price, 0);
  const discount = isCommunityDiscount ? subtotal * 0.15 : 0;
  const total = subtotal - discount;

  const toggleService = (serviceId: number) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const createOrder = () => {
    if (selectedServices.length === 0 || !carBrand || !carModel) return;
    
    const newOrder: Order = {
      id: orders.length + 1,
      date: new Date().toISOString().split('T')[0],
      carBrand,
      carModel,
      services: selectedServicesData.map(s => s.name),
      total,
      hasCommunityDiscount: isCommunityDiscount
    };
    
    setOrders([newOrder, ...orders]);
    setSelectedServices([]);
    setCarBrand("");
    setCarModel("");
    setIsCommunityDiscount(false);
    setShowCalculator(false);
    setCurrentTab("orders");
  };

  const totalEarnings = orders.reduce((sum, order) => sum + order.total, 0);
  const carStats = orders.reduce((acc, order) => {
    const key = `${order.carBrand} ${order.carModel}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (selectedCategory && !showCalculator) {
    const category = categories.find(c => c.id === selectedCategory);
    return (
      <div className="min-h-screen bg-background dark">
        <div className="bg-card border-b border-border p-4">
          <div className="max-w-md mx-auto flex items-center gap-3">
            <Button 
              variant="ghost" 
              onClick={() => setSelectedCategory(null)}
              className="text-muted-foreground hover:text-foreground p-2"
            >
              <Icon name="ArrowLeft" size={20} />
            </Button>
            <Icon name={category?.icon as any} size={24} className="text-primary" />
            <h1 className="text-lg font-bold text-foreground">{category?.name}</h1>
          </div>
        </div>

        <div className="max-w-md mx-auto p-4 space-y-3">
          {category?.services.map((service) => (
            <Card key={service.id} className="bg-card border-border hover:bg-muted/30 transition-colors">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-foreground">{service.name}</h3>
                    <p className="text-sm text-muted-foreground">от {service.price.toLocaleString()} ₽</p>
                  </div>
                  <Button 
                    size="sm"
                    onClick={() => {
                      setSelectedServices([service.id]);
                      setShowCalculator(true);
                    }}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Выбрать
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark">
      <div className="bg-card border-b border-border p-4">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <Icon name="Calculator" size={28} className="text-primary" />
          <h1 className="text-xl font-bold text-foreground">Автосервис Калькулятор</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto">
        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="grid w-full grid-cols-3 bg-card border-b border-border rounded-none">
            <TabsTrigger value="home" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="Home" size={16} className="mr-2" />
              Главная
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="ClipboardList" size={16} className="mr-2" />
              Заказы
            </TabsTrigger>
            <TabsTrigger value="stats" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="BarChart3" size={16} className="mr-2" />
              Статистика
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="p-4 space-y-4">
            {!showCalculator ? (
              <>
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-foreground">Категории услуг</h2>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {categories.map((category) => (
                      <div 
                        key={category.id} 
                        onClick={() => setSelectedCategory(category.id)}
                        className="bg-card border border-border rounded-xl p-4 hover:bg-muted/50 transition-colors cursor-pointer group"
                      >
                        <div className="text-center space-y-2">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-colors">
                            <Icon name={category.icon as any} size={24} className="text-primary" />
                          </div>
                          <h3 className="text-sm font-medium text-foreground leading-tight">{category.name}</h3>
                          <p className="text-xs text-muted-foreground">{category.services.length} услуг</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-base font-medium text-foreground mb-3">Популярные услуги</h3>
                    <div className="space-y-2">
                      {[
                        { name: "Замена масла", price: 1500, category: "ТО" },
                        { name: "Диагностика", price: 1200, category: "ТО" },
                        { name: "Покраска элемента", price: 3000, category: "Кузов" },
                      ].map((service, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-card border border-border rounded-lg hover:bg-muted/30 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                              <Icon name="Star" size={14} className="text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">{service.name}</p>
                              <p className="text-xs text-muted-foreground">{service.category}</p>
                            </div>
                          </div>
                          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                            {service.price.toLocaleString()} ₽
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={() => setShowCalculator(true)}
                  className="w-full h-14 text-lg bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Icon name="Plus" size={20} className="mr-2" />
                  Создать заказ
                </Button>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <Button 
                    variant="ghost" 
                    onClick={() => setShowCalculator(false)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Icon name="ArrowLeft" size={20} className="mr-2" />
                    Назад
                  </Button>
                  <h2 className="text-lg font-semibold text-foreground">Новый заказ</h2>
                </div>

                <Card className="bg-card border-border">
                  <CardContent className="p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm text-muted-foreground">Марка</label>
                        <Input
                          value={carBrand}
                          onChange={(e) => setCarBrand(e.target.value)}
                          placeholder="Toyota"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">Модель</label>
                        <Input
                          value={carModel}
                          onChange={(e) => setCarModel(e.target.value)}
                          placeholder="Camry"
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-foreground text-base">Выберите услуги</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {categories.map((category) => (
                      <div key={category.id}>
                        <h4 className="font-medium text-sm text-muted-foreground mb-2 flex items-center gap-2">
                          <Icon name={category.icon as any} size={16} />
                          {category.name}
                        </h4>
                        <div className="space-y-2 ml-6">
                          {category.services.map((service) => (
                            <div key={service.id} className="flex items-center justify-between p-2 hover:bg-muted rounded-lg">
                              <div className="flex items-center space-x-3">
                                <Checkbox
                                  checked={selectedServices.includes(service.id)}
                                  onCheckedChange={() => toggleService(service.id)}
                                />
                                <span className="text-sm text-foreground">{service.name}</span>
                              </div>
                              <span className="text-sm text-muted-foreground">{service.price.toLocaleString()} ₽</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <div className="flex items-center space-x-3 p-4 bg-card border border-border rounded-lg">
                  <Checkbox
                    checked={isCommunityDiscount}
                    onCheckedChange={setIsCommunityDiscount}
                  />
                  <div>
                    <span className="text-sm text-foreground">Скидка для общинников</span>
                    <p className="text-xs text-muted-foreground">Скидка 15% на все услуги</p>
                  </div>
                </div>

                {selectedServices.length > 0 && (
                  <Card className="bg-card border-border">
                    <CardContent className="p-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Подытог:</span>
                        <span className="text-foreground">{subtotal.toLocaleString()} ₽</span>
                      </div>
                      
                      {isCommunityDiscount && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Скидка (-15%):</span>
                          <span className="text-primary">-{discount.toLocaleString()} ₽</span>
                        </div>
                      )}
                      
                      <Separator />
                      
                      <div className="flex justify-between text-lg font-bold">
                        <span className="text-foreground">К оплате:</span>
                        <span className="text-primary">{total.toLocaleString()} ₽</span>
                      </div>
                      
                      <Button 
                        onClick={createOrder}
                        disabled={!carBrand || !carModel || selectedServices.length === 0}
                        className="w-full mt-3 bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        <Icon name="Check" size={20} className="mr-2" />
                        Оформить заказ
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="orders" className="p-4 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">История заказов</h2>
            
            {orders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Icon name="ClipboardList" size={48} className="mx-auto mb-4 opacity-50" />
                <p>Заказов пока нет</p>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <Card key={order.id} className="bg-card border-border">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium text-foreground">{order.carBrand} {order.carModel}</h3>
                          <p className="text-sm text-muted-foreground">{new Date(order.date).toLocaleDateString('ru')}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary">{order.total.toLocaleString()} ₽</p>
                          {order.hasCommunityDiscount && (
                            <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
                              -15%
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {order.services.join(", ")}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="stats" className="p-4 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Статистика</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-card border-border">
                <CardContent className="p-4 text-center">
                  <Icon name="DollarSign" size={32} className="text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">{totalEarnings.toLocaleString()} ₽</p>
                  <p className="text-sm text-muted-foreground">Общий доход</p>
                </CardContent>
              </Card>
              
              <Card className="bg-card border-border">
                <CardContent className="p-4 text-center">
                  <Icon name="Car" size={32} className="text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">{orders.length}</p>
                  <p className="text-sm text-muted-foreground">Всего заказов</p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground text-base">Популярные модели</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(carStats)
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 5)
                  .map(([car, count]) => (
                    <div key={car} className="flex justify-between items-center">
                      <span className="text-foreground">{car}</span>
                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                        {count} заказ{count > 1 ? (count > 4 ? 'ов' : 'а') : ''}
                      </Badge>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;